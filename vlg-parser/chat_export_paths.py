"""
Где лежит папка экспорта Telegram (JSON + photos/ и т.д.).
По умолчанию — внутри vlg-parser/: ChatExport или ChatExport_YYYY-MM-DD.
"""

from __future__ import annotations

import os
from pathlib import Path


def resolve_chat_export_dir(
    parser_root: Path,
    override: Path | None = None,
) -> Path:
    """
    Порядок:
    1) явный путь (аргумент CLI);
    2) переменная окружения CHAT_EXPORT_DIR;
    3) единственная подходящая папка vlg-parser/ChatExport* с result.json;
    4) при нескольких — самая свежая по mtime.
    """
    if override is not None:
        p = override.resolve()
        if not (p / "result.json").is_file():
            raise FileNotFoundError(f"Нет result.json: {p}")
        return p

    env = os.environ.get("CHAT_EXPORT_DIR", "").strip()
    if env:
        p = Path(env).expanduser().resolve()
        if not (p / "result.json").is_file():
            raise FileNotFoundError(
                f"CHAT_EXPORT_DIR={env!r}: нет result.json по этому пути"
            )
        return p

    candidates: list[Path] = []
    for c in sorted(parser_root.glob("ChatExport*")):
        if c.is_dir() and (c / "result.json").is_file():
            candidates.append(c)

    if not candidates:
        raise FileNotFoundError(
            f"Не найдена папка экспорта с result.json в {parser_root}. "
            "Положите ChatExport (или ChatExport_дата) сюда или задайте CHAT_EXPORT_DIR."
        )

    if len(candidates) == 1:
        return candidates[0].resolve()

    return max(candidates, key=lambda d: d.stat().st_mtime).resolve()
