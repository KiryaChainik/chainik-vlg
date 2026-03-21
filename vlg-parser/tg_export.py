"""
Экспорт Telegram ChatExport (result.json) → MDX в content/news/ и медиа в public/.

Правила:
- только «новости»: первый значимый фрагмент текста — молния (⚡ / ⚡️ или custom_emoji с текстом ⚡);
- альбомы: подряд id+1, разница date_unixtime ≤ 2 с, пустой подпись у продолжений, только фото;
- первая картинка — cover; все фото в <ArticleGallery> (горизонтальный скролл), без отдельного заголовка;
- первый файл — видео: <video> в теле, расширения файлов при копировании в нижнем регистре.
"""

from __future__ import annotations

import html
import json
import os
import re
import shutil
from pathlib import Path
from typing import Any

from news_tag_rules import build_news_tags

# Соседние сегменты одного типа склеиваем, иначе Markdown даёт артефакты вроде *a**b*
# (две italic подряд превращались бы в *a**b*).
_MERGE_ENTITY_TYPES = frozenset({"bold", "italic", "strikethrough", "code"})

# Unicode: ⚡ (U+26A1), ⚡️ = U+26A1 + U+FE0F
_ZAP = "\u26a1"
_ZAP_VS = "\u26a1\ufe0f"


def _plain_from_text_field(text_field: Any) -> str:
    if isinstance(text_field, str):
        return text_field
    if isinstance(text_field, list):
        parts: list[str] = []
        for item in text_field:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                parts.append(item.get("text") or "")
        return "".join(parts)
    return ""


def _starts_with_lightning(s: str) -> bool:
    t = s.lstrip()
    if not t:
        return False
    if t.startswith(_ZAP_VS):
        return True
    if t.startswith(_ZAP):
        return True
    return False


def _is_lightning_custom_emoji(item: dict[str, Any]) -> bool:
    if item.get("type") != "custom_emoji":
        return False
    tx = (item.get("text") or "").strip()
    return tx in (_ZAP, _ZAP_VS) or tx == "\u26a1"


def is_news_post(text_field: Any) -> bool:
    """Первый значимый фрагмент текста — молния (символ или custom_emoji ⚡)."""
    if text_field is None:
        return False
    if isinstance(text_field, str):
        s = text_field.lstrip()
        return _starts_with_lightning(s)

    if not isinstance(text_field, list):
        return False

    for item in text_field:
        if isinstance(item, str):
            s = item.lstrip()
            if not s:
                continue
            return _starts_with_lightning(s)
        if isinstance(item, dict):
            txt = item.get("text") or ""
            t = txt.lstrip()
            if not t:
                continue
            ty = item.get("type") or "plain"
            if _is_lightning_custom_emoji(item):
                return True
            if ty in (
                "plain",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "code",
                "spoiler",
            ):
                return _starts_with_lightning(t)
            if ty == "text_link":
                return _starts_with_lightning(t)
            return False
    return False


def _escape_md_plain(s: str) -> str:
    """Экранирование «сырого» текста для MDX: &, <, > (ложные JSX-теги) и *, _, `, ~."""
    s = html.escape(s)
    return "".join("\\" + c if c in "\\*_`~" else c for c in s)


_PLAIN_ITALIC_SPAN = re.compile(r"\*([^*]+)\*")


def _plain_italic_star_spans_to_em(s: str) -> bool:
    """
    Подходит ли *текст* в plain для замены на <em>.
    Не трогаем одиночную латинскую букву (*x* в формулах); одна кириллическая буква — ок.
    """
    t = s.strip()
    if not t:
        return False
    if not re.search(r"[A-Za-zА-Яа-яЁё]", t):
        return False
    if len(t) == 1:
        return bool(re.match(r"[А-Яа-яЁё]$", t))
    return True


def _escape_plain_line_for_mdx(s: str) -> str:
    """
    Одна строка plain: экранирование + одиночные *курсив* без сущности italic в JSON
    (иначе * экранируются и на сайте видны буквальные звёздочки).
    """
    if "*" not in s:
        return _escape_md_plain(s)
    out: list[str] = []
    pos = 0
    for m in _PLAIN_ITALIC_SPAN.finditer(s):
        out.append(_escape_md_plain(s[pos : m.start()]))
        inner = m.group(1)
        if _plain_italic_star_spans_to_em(inner):
            out.append(f"<em>{html.escape(inner)}</em>")
        else:
            out.append(_escape_md_plain(m.group(0)))
        pos = m.end()
    out.append(_escape_md_plain(s[pos:]))
    return "".join(out)


def _format_plain_paragraphs(s: str) -> str:
    """
    В CommonMark один \\n внутри абзаца превращается в пробел в HTML.
    Разбиваем plain-текст по \\n на отдельные абзацы (\\n\\n), как в Telegram.
    """
    if "\n" not in s:
        return _escape_plain_line_for_mdx(s)
    return "\n\n".join(_escape_plain_line_for_mdx(line) for line in s.split("\n"))


def _merge_adjacent_entity_runs(items: list[Any]) -> list[Any]:
    out: list[Any] = []
    for item in items:
        if isinstance(item, dict) and out and isinstance(out[-1], dict):
            pr = out[-1]
            t1 = pr.get("type") or "plain"
            t2 = item.get("type") or "plain"
            if t1 == t2 and t1 in _MERGE_ENTITY_TYPES:
                pr["text"] = (pr.get("text") or "") + (item.get("text") or "")
                continue
        out.append(item)
    return out


def _html_escape_with_br(s: str) -> str:
    """Экранирование + переносы строк как <br />, чтобы MDX не рвал абзац внутри inline-тегов."""
    return html.escape(s).replace("\n", "<br />")


def _split_inline_edge_spaces(s: str) -> tuple[str, str, str]:
    """Пробелы/табы по краям однострочного фрагмента — выносим из ** / * / ~~."""
    m = len(s) - len(s.lstrip(" \t"))
    lead = s[:m]
    rest = s[m:]
    if not rest:
        return lead, "", ""
    m2 = len(rest) - len(rest.rstrip(" \t"))
    core = rest[:-m2] if m2 else rest
    trail = rest[-m2:] if m2 else ""
    return lead, core, trail


def _md_bold(txt: str) -> str:
    if not txt:
        return ""
    if not txt.strip():
        return _escape_md_plain(txt)
    if "\n" in txt:
        return f"<strong>{_html_escape_with_br(txt)}</strong>"
    lead, core, trail = _split_inline_edge_spaces(txt)
    if not core or not core.strip():
        return _escape_md_plain(txt)
    inner = html.escape(core).replace("\\", "\\\\").replace("*", "\\*")
    return _escape_md_plain(lead) + f"**{inner}**" + _escape_md_plain(trail)


def _md_italic(txt: str) -> str:
    if not txt:
        return ""
    if not txt.strip():
        return _escape_md_plain(txt)
    if "\n" in txt:
        return f"<em>{_html_escape_with_br(txt)}</em>"
    lead, core, trail = _split_inline_edge_spaces(txt)
    if not core or not core.strip():
        return _escape_md_plain(txt)
    inner = html.escape(core).replace("\\", "\\\\").replace("*", "\\*").replace("_", "\\_")
    return _escape_md_plain(lead) + f"*{inner}*" + _escape_md_plain(trail)


def _md_strikethrough(txt: str) -> str:
    if not txt:
        return ""
    if not txt.strip():
        return _escape_md_plain(txt)
    if "\n" in txt:
        return f"<del>{_html_escape_with_br(txt)}</del>"
    lead, core, trail = _split_inline_edge_spaces(txt)
    if not core or not core.strip():
        return _escape_md_plain(txt)
    inner = html.escape(core).replace("\\", "\\\\").replace("~", "\\~")
    return _escape_md_plain(lead) + f"~~{inner}~~" + _escape_md_plain(trail)


def _md_code(txt: str) -> str:
    if not txt:
        return ""
    if "`" in txt:
        return f"`{txt.replace('`', '``')}`"
    return f"`{txt}`"


def _md_text_link(text: str, href: str) -> str:
    t = text.replace("\\", "\\\\").replace("]", "\\]")
    t = html.escape(t)
    h = href.strip()
    return f"[{t}]({h})"


def _next_dict_item(items: list[Any], idx: int) -> dict[str, Any] | None:
    j = idx + 1
    while j < len(items):
        it = items[j]
        if isinstance(it, dict):
            return it
        j += 1
    return None


def text_field_to_markdown(text_field: Any) -> str:
    if isinstance(text_field, str):
        return _format_plain_paragraphs(text_field)
    if not isinstance(text_field, list):
        return ""

    items = _merge_adjacent_entity_runs(text_field)
    out: list[str] = []
    at_line_start = True

    def append_chunk(chunk: str) -> None:
        nonlocal at_line_start
        if not chunk:
            return
        out.append(chunk)
        at_line_start = chunk.endswith("\n")

    for i, item in enumerate(items):
        if isinstance(item, str):
            append_chunk(_format_plain_paragraphs(item))
            continue
        if not isinstance(item, dict):
            continue
        ty = item.get("type") or "plain"
        txt = item.get("text") or ""
        if ty == "plain":
            append_chunk(_format_plain_paragraphs(txt))
        elif ty == "bold":
            append_chunk(_md_bold(txt))
        elif ty == "italic":
            append_chunk(_md_italic(txt))
        elif ty == "underline":
            inner = _html_escape_with_br(txt) if "\n" in txt else html.escape(txt)
            append_chunk(f"<u>{inner}</u>")
        elif ty == "strikethrough":
            append_chunk(_md_strikethrough(txt))
        elif ty == "code":
            append_chunk(_md_code(txt))
        elif ty == "text_link":
            href = item.get("href") or ""
            append_chunk(_md_text_link(txt, href))
        elif ty == "link":
            href = (item.get("href") or txt or "").strip()
            label = (txt or href).strip()
            if not href:
                append_chunk(_escape_md_plain(txt))
            else:
                append_chunk(_md_text_link(label, href))
        elif ty == "spoiler":
            inner = _html_escape_with_br(txt) if "\n" in txt else html.escape(txt)
            append_chunk(f'<span class="tg-spoiler">{inner}</span>')
        elif ty == "hashtag":
            piece = txt
            if at_line_start and piece.startswith("#"):
                piece = "\\" + piece
            nd = _next_dict_item(items, i)
            if nd and (nd.get("type") or "plain") == "bold":
                piece += "\u200b"
            append_chunk(html.escape(piece))
        elif ty == "mention":
            append_chunk(_escape_md_plain(txt))
        elif ty == "mention_name":
            append_chunk(_escape_md_plain(txt))
        elif ty == "phone":
            append_chunk(_escape_md_plain(txt))
        elif ty == "email":
            append_chunk(_escape_md_plain(txt))
        elif ty == "bot_command":
            append_chunk(_escape_md_plain(txt))
        elif ty == "custom_emoji":
            append_chunk(html.escape(txt))
        elif ty == "blockquote":
            for line in txt.splitlines():
                append_chunk(f"> {_escape_plain_line_for_mdx(line)}\n")
        else:
            append_chunk(_format_plain_paragraphs(txt))
    return "".join(out)


def message_text_to_markdown(msg: dict[str, Any]) -> str:
    """Текст сообщения: list (rich) или string + text_entities (как list фрагментов)."""
    t = msg.get("text")
    if isinstance(t, list):
        return text_field_to_markdown(t)
    if isinstance(t, str):
        ents = msg.get("text_entities")
        if isinstance(ents, list) and ents and all(isinstance(e, dict) for e in ents):
            types = {e.get("type") or "plain" for e in ents}
            if types <= {"plain"}:
                return _format_plain_paragraphs(t)
            return text_field_to_markdown(ents)
        return _format_plain_paragraphs(t)
    return ""


def strip_leading_lightning(s: str) -> str:
    s = s.strip()
    if s.startswith(_ZAP_VS):
        s = s[len(_ZAP_VS) :]
    elif s.startswith(_ZAP):
        s = s[len(_ZAP) :]
        if s.startswith("\ufe0f"):
            s = s[1:]
    s = s.lstrip()
    return s


def extract_hashtags(plain: str) -> list[str]:
    tags = re.findall(r"#[\w\u0400-\u04FF\d_]+", plain)
    return list(dict.fromkeys(tags))


def slugify_title(plain: str, msg_id: int, max_len: int = 72) -> str:
    plain = plain.strip().lower()
    plain = re.sub(r"\s+", "-", plain)
    plain = re.sub(r"[^\w\-]+", "-", plain, flags=re.UNICODE)
    plain = re.sub(r"-+", "-", plain).strip("-")
    if not plain:
        plain = f"post-{msg_id}"
    if len(plain) > max_len:
        plain = plain[:max_len].rstrip("-")
    return plain


def make_slug(msg_id: int, plain: str) -> str:
    base = slugify_title(plain, msg_id)
    s = f"{msg_id}-{base}"
    if len(s) > 180:
        s = s[:180].rstrip("-")
    return s


def _date_only(iso_date: str) -> str:
    if "T" in iso_date:
        return iso_date.split("T", 1)[0]
    return iso_date[:10]


def _yaml_scalar(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def _resolve_content_root(repo_root: Path) -> Path:
    raw = os.environ.get("CONTENT_DIR", "").strip()
    if raw:
        p = Path(raw)
        return p if p.is_absolute() else (repo_root / p).resolve()
    return (repo_root / "content").resolve()


def _empty_caption(text_field: Any) -> bool:
    return not _plain_from_text_field(text_field).strip()


def _is_photo_only_continuation(m: dict[str, Any]) -> bool:
    if m.get("poll"):
        return False
    if m.get("media_type") == "video_file":
        return False
    if not m.get("photo"):
        return False
    return _empty_caption(m.get("text"))


def _is_album_continuation(mx: dict[str, Any], prev: dict[str, Any]) -> bool:
    if not _is_photo_only_continuation(mx):
        return False
    try:
        i_mx = int(mx.get("id"))
        i_pv = int(prev.get("id"))
        u_mx = int(mx.get("date_unixtime") or 0)
        u_pv = int(prev.get("date_unixtime") or 0)
    except (TypeError, ValueError):
        return False
    if i_mx != i_pv + 1:
        return False
    dt = u_mx - u_pv
    if dt < 0 or dt > 2:
        return False
    return True


def _first_media_kind(m: dict[str, Any]) -> str | None:
    if m.get("media_type") == "video_file" and m.get("file"):
        return "video"
    if m.get("photo"):
        return "photo"
    return None


def _collect_photo_paths(group: list[dict[str, Any]]) -> list[str]:
    paths: list[str] = []
    for m in group:
        ph = m.get("photo")
        if ph:
            paths.append(str(ph).replace("\\", "/"))
    return paths


def _copy_photo_to_covers(
    chat_export_dir: Path,
    covers_dir: Path,
    rel: str,
    dest_name: str,
) -> str | None:
    src = chat_export_dir / rel.replace("\\", "/")
    if not src.is_file():
        return None
    ext = src.suffix.lower() or ".jpg"
    dest = covers_dir / f"{dest_name}{ext}"
    shutil.copy2(src, dest)
    return f"/covers/news/{dest.name}"


def _copy_video_lower(
    chat_export_dir: Path,
    dest_dir: Path,
    rel: str,
) -> tuple[str, str] | None:
    """Возвращает (публичный URL, локальное имя файла)."""
    src = chat_export_dir / str(rel).replace("\\", "/")
    if not src.is_file():
        return None
    ext = src.suffix.lower() or ".mp4"
    name = f"{src.stem}{ext}"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / name
    shutil.copy2(src, dest)
    pub = f"/news-media/{dest_dir.name}/{name}"
    return pub, name


def _build_news_groups(messages: list[dict[str, Any]]) -> list[list[dict[str, Any]]]:
    groups: list[list[dict[str, Any]]] = []
    i = 0
    n = len(messages)
    while i < n:
        m = messages[i]
        if not is_news_post(m.get("text")):
            i += 1
            continue
        group = [m]
        j = i + 1
        prev = m
        while j < n:
            mx = messages[j]
            if _is_album_continuation(mx, prev):
                group.append(mx)
                prev = mx
                j += 1
            else:
                break
        groups.append(group)
        i = j
    return groups


def export_telegram_chat(
    chat_export_dir: Path,
    *,
    repo_root: Path,
    limit: int | None = None,
    category: str = "Telegram",
    author_override: str | None = None,
) -> dict[str, int]:
    result_path = chat_export_dir / "result.json"
    if not result_path.is_file():
        raise FileNotFoundError(result_path)

    with open(result_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    channel_name = author_override or data.get("name") or "Редакция"
    messages: list[dict[str, Any]] = [
        m for m in data.get("messages") or [] if m.get("type") == "message"
    ]

    content_root = _resolve_content_root(repo_root)
    news_dir = content_root / "news"
    news_dir.mkdir(parents=True, exist_ok=True)

    covers_dir = repo_root / "public" / "covers" / "news"
    covers_dir.mkdir(parents=True, exist_ok=True)
    media_root = repo_root / "public" / "news-media"
    media_root.mkdir(parents=True, exist_ok=True)

    groups = _build_news_groups(messages)
    written = 0

    for group in groups:
        if limit is not None and written >= limit:
            break

        first = group[0]
        msg_id = int(first.get("id") or 0)
        plain_full = _plain_from_text_field(first.get("text"))
        plain_for_slug = strip_leading_lightning(plain_full)
        if not plain_for_slug.strip():
            plain_for_slug = f"новость-{msg_id}"

        slug = make_slug(msg_id, plain_for_slug)

        title_line = plain_for_slug.strip().split("\n")[0][:200]
        if len(title_line) > 120:
            title_line = title_line[:117] + "…"
        if not title_line:
            title_line = f"Новость {msg_id}"

        desc = plain_for_slug.strip()
        if len(desc) > 280:
            desc = desc[:277] + "…"

        date_iso = _date_only(first.get("date") or "1970-01-01T00:00:00")
        first_kind = _first_media_kind(first)
        has_video = first_kind == "video"
        tags = build_news_tags(
            plain_full,
            title_line,
            extract_hashtags(plain_full),
            slug=slug,
            has_video=has_video,
        )

        body_md = message_text_to_markdown(first).strip()
        body_parts: list[str] = []
        if body_md:
            body_parts.append(body_md)

        cover_url: str | None = None
        all_photo_urls: list[str] = []
        photo_rels = _collect_photo_paths(group)

        # Видео как первый медиафайл в первом сообщении группы
        if first_kind == "video" and first.get("file"):
            sub = media_root / slug
            sub.mkdir(parents=True, exist_ok=True)
            rel = str(first["file"]).replace("\\", "/")
            copied = _copy_video_lower(chat_export_dir, sub, rel)
            if copied:
                pub, _ = copied
                body_parts.append("")
                body_parts.append(
                    f'<video src="{html.escape(pub)}" controls playsInline preload="metadata" />'
                )
            if first.get("thumbnail"):
                tr = str(first["thumbnail"]).replace("\\", "/")
                tsrc = chat_export_dir / tr
                if tsrc.is_file():
                    ext = tsrc.suffix.lower() or ".jpg"
                    tdest = covers_dir / f"{slug}-video-thumb{ext}"
                    shutil.copy2(tsrc, tdest)
                    cover_url = f"/covers/news/{tdest.name}"

        elif photo_rels:
            # Первое фото — cover; в <ArticleGallery> — все фото альбома (включая первое).
            for idx, prel in enumerate(photo_rels):
                dest_stem = f"{slug}-cover" if idx == 0 else f"{slug}-gallery-{idx}"
                url = _copy_photo_to_covers(chat_export_dir, covers_dir, prel, dest_stem)
                if not url:
                    continue
                if idx == 0:
                    cover_url = url
                all_photo_urls.append(url)

            if all_photo_urls:
                body_parts.append("\n\n<ArticleGallery>\n\n")
                for gidx, gurl in enumerate(all_photo_urls, start=1):
                    alt = f"Фото {gidx}"
                    body_parts.append(f"![{alt}]({gurl})\n\n")
                body_parts.append("</ArticleGallery>\n")

        full_body = "\n".join(body_parts).strip()
        if not full_body:
            full_body = "_(без текста)_"

        images_yaml = ""
        if all_photo_urls:
            images_yaml = f"images: {json.dumps(all_photo_urls, ensure_ascii=False)}\n"

        fm_lines = [
            "---",
            f"title: {_yaml_scalar(title_line)}",
            f"description: {_yaml_scalar(desc)}",
            f"date: {_yaml_scalar(date_iso)}",
            f"category: {_yaml_scalar(category)}",
            f"tags: {json.dumps(tags, ensure_ascii=False)}",
            "published: true",
            f"author: {_yaml_scalar(channel_name)}",
        ]
        if images_yaml:
            fm_lines.append(images_yaml.rstrip())
        if cover_url:
            fm_lines.append(f"cover: {_yaml_scalar(cover_url)}")
        fm_lines.append("---")
        fm_lines.append("")

        mdx = "\n".join(fm_lines) + full_body + "\n"
        out_path = news_dir / f"{slug}.mdx"
        out_path.write_text(mdx, encoding="utf-8")
        written += 1

        if written % 500 == 0:
            print(f"[vlg-parser] записано {written} новостей…", flush=True)

    return {
        "written": written,
        "total_message_rows": len(messages),
        "news_groups": len(groups),
    }
