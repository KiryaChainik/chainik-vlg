"""
Очистка перед повторным экспортом Telegram → MDX: новости, локальные медиа, кэш Next.js.
"""

from __future__ import annotations

import os
import re
import shutil
from pathlib import Path

# Имена из content.example — не трогаем при чистке «плоских» обложек в public/covers/
_PROTECTED_COVER_NAMES = frozenset(
    {
        "news-test.jpg",
        "review-test.jpg",
    }
)

# Файлы, сгенерированные парсером: <id>-<slug>.(jpg|…)
_TG_COVER_NAME = re.compile(
    r"^\d+-[^/\\]+\.(jpe?g|png|webp|gif|avif)$",
    re.IGNORECASE,
)


def find_repo_root(start: Path | None = None) -> Path:
    """Корень репозитория (родитель vlg-parser/ или каталог с .git)."""
    here = (start or Path(__file__).resolve()).parent
    cur = here
    for _ in range(8):
        if (cur / ".git").is_dir():
            return cur
        if (cur / "package.json").is_file() and (cur / "src").is_dir():
            return cur
        parent = cur.parent
        if parent == cur:
            break
        cur = parent
    return here.parent


def resolve_content_root(repo_root: Path) -> Path:
    raw = os.environ.get("CONTENT_DIR", "").strip()
    if raw:
        p = Path(raw)
        return p if p.is_absolute() else (repo_root / p).resolve()
    private = repo_root / "content"
    if private.is_dir():
        return private.resolve()
    return (repo_root / "content.example").resolve()


def wipe_news_mdx(content_root: Path, *, dry_run: bool = False) -> int:
    """Удаляет все *.mdx в content/…/news/."""
    news_dir = content_root / "news"
    if not news_dir.is_dir():
        return 0
    n = 0
    for f in news_dir.glob("*.mdx"):
        if not dry_run:
            f.unlink()
        n += 1
    return n


def wipe_parser_cover_subdir(
    public_root: Path, subdir: str = "covers/news", *, dry_run: bool = False
) -> int:
    """Удаляет каталог public/<subdir> целиком (рекомендуемое место для обложек экспорта)."""
    d = public_root / subdir
    if not d.is_dir():
        return 0
    if dry_run:
        return 1
    shutil.rmtree(d)
    d.mkdir(parents=True, exist_ok=True)
    return 1


def wipe_flat_tg_covers(covers_dir: Path, *, dry_run: bool = False) -> int:
    """
    Удаляет в public/covers/ только файлы вида 12345-slug.jpg (старый «плоский» вывод парсера).
    Демо-файлы (news-test.jpg и т.д.) не трогаются.
    """
    if not covers_dir.is_dir():
        return 0
    n = 0
    for f in covers_dir.iterdir():
        if not f.is_file():
            continue
        if f.name in _PROTECTED_COVER_NAMES:
            continue
        if _TG_COVER_NAME.match(f.name):
            if not dry_run:
                f.unlink()
            n += 1
    return n


def clear_nextjs_caches(
    repo_root: Path, *, purge_entire_next: bool = False, dry_run: bool = False
) -> list[str]:
    """
    Очищает кэш сборки Next.js. По умолчанию — только cache / dev/cache (быстрее, чем rm -rf .next).
    При purge_entire_next — удаляется весь каталог .next.
    """
    next_dir = repo_root / ".next"
    touched: list[str] = []
    if not next_dir.is_dir():
        return touched

    if purge_entire_next:
        if not dry_run:
            shutil.rmtree(next_dir)
        touched.append(str(next_dir))
        return touched

    for rel in ("cache", "dev/cache"):
        p = next_dir / rel
        if p.is_dir():
            if not dry_run:
                shutil.rmtree(p)
            touched.append(str(p))
    return touched


def clear_tsbuildinfo(repo_root: Path, *, dry_run: bool = False) -> bool:
    p = repo_root / "tsconfig.tsbuildinfo"
    if p.is_file():
        if not dry_run:
            p.unlink()
        return True
    return False


def cleanup_before_export(
    repo_root: Path | None = None,
    *,
    content_root: Path | None = None,
    wipe_flat_covers: bool = True,
    covers_subdir: str = "covers/news",
    purge_entire_next: bool = False,
    dry_run: bool = False,
) -> dict[str, object]:
    """
    Полная подготовка к новому экспорту: MDX новостей, обложки, кэш Next.js.
    """
    root = repo_root or find_repo_root()
    content = content_root or resolve_content_root(root)
    public = root / "public"

    n_mdx = wipe_news_mdx(content, dry_run=dry_run)
    n_sub = wipe_parser_cover_subdir(public, subdir=covers_subdir, dry_run=dry_run)
    n_flat = (
        wipe_flat_tg_covers(public / "covers", dry_run=dry_run)
        if wipe_flat_covers
        else 0
    )
    next_paths = clear_nextjs_caches(
        root, purge_entire_next=purge_entire_next, dry_run=dry_run
    )
    tsinfo = clear_tsbuildinfo(root, dry_run=dry_run)

    return {
        "repo_root": str(root),
        "content_root": str(content),
        "dry_run": dry_run,
        "removed_news_mdx": n_mdx,
        "reset_covers_subdir": n_sub,
        "removed_flat_covers": n_flat,
        "cleared_next_paths": next_paths,
        "removed_tsbuildinfo": tsinfo,
    }
