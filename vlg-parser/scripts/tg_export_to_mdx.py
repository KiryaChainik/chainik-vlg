#!/usr/bin/env python3
"""
Экспорт Telegram → MDX для chainik-vlg.

Перед записью по умолчанию полностью удаляет предыдущий экспорт новостей
(content/news/*.mdx), локальные обложки парсера и кэш Next.js — чтобы не копить
дубликаты и освобождать место.

Дальше в этом файле должна быть ваша логика чтения экспорта Telegram и записи MDX/файлов в public/.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Пакет лежит в vlg-parser/
_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from chat_export_paths import resolve_chat_export_dir  # noqa: E402
from export_cleanup import cleanup_before_export, find_repo_root  # noqa: E402
from tg_export import export_telegram_chat  # noqa: E402

_PARSER_ROOT = Path(__file__).resolve().parents[1]


def run_export(
    *,
    chat_export_dir: Path,
    repo_root: Path,
    limit: int | None = None,
    author: str | None = None,
) -> None:
    result = chat_export_dir / "result.json"
    print(f"[vlg-parser] Экспорт Telegram: {chat_export_dir}", file=sys.stderr)
    print(f"[vlg-parser] result.json: {result.stat().st_size // 1024} KiB", file=sys.stderr)
    stats = export_telegram_chat(
        chat_export_dir,
        repo_root=repo_root,
        limit=limit,
        author_override=author,
    )
    print("[vlg-parser] Готово:", stats, file=sys.stderr)


def main() -> int:
    p = argparse.ArgumentParser(
        description="Telegram → MDX: очистка старого контента и кэша, затем экспорт."
    )
    p.add_argument(
        "--no-clean",
        action="store_true",
        help="Не удалять старые news/*.mdx и кэш перед экспортом (как раньше).",
    )
    p.add_argument(
        "--clean-only",
        action="store_true",
        help="Только очистка, без run_export().",
    )
    p.add_argument(
        "--no-flat-covers",
        action="store_true",
        help="Не удалять плоские файлы public/covers/12345-slug.jpg (только covers/news/).",
    )
    p.add_argument(
        "--purge-next",
        action="store_true",
        help="Удалить весь каталог .next (полная пересборка; дольше следующий build).",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="Только показать, что будет удалено (ничего не стирать).",
    )
    p.add_argument(
        "--chat-export",
        type=Path,
        default=None,
        metavar="DIR",
        help="Папка экспорта с result.json (по умолчанию: vlg-parser/ChatExport* или CHAT_EXPORT_DIR).",
    )
    p.add_argument(
        "--limit",
        type=int,
        default=None,
        metavar="N",
        help="Записать только первые N подходящих сообщений (для проверки).",
    )
    p.add_argument(
        "--author",
        type=str,
        default=None,
        metavar="NAME",
        help="Переопределить автора в frontmatter (по умолчанию — имя канала из JSON).",
    )
    args = p.parse_args()

    repo = find_repo_root(Path(__file__).resolve())

    if not args.no_clean:
        report = cleanup_before_export(
            repo,
            wipe_flat_covers=not args.no_flat_covers,
            purge_entire_next=args.purge_next,
            dry_run=args.dry_run,
        )
        print("[vlg-parser] Очистка перед экспортом:")
        for k, v in report.items():
            print(f"  {k}: {v}")

    if args.clean_only:
        return 0

    chat_dir = resolve_chat_export_dir(_PARSER_ROOT, override=args.chat_export)
    run_export(
        chat_export_dir=chat_dir,
        repo_root=repo,
        limit=args.limit,
        author=args.author,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
