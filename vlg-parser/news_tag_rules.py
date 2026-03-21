"""
Правила извлечения тегов из текста новости (Telegram → MDX).

До **10** тегов, только из текста/хэштегов/slug — без выдуманных «общих» слов.
Без «новость»/«новости»/tg-export и без мусорных тегов вроде «периферия»/«железо».
"""

from __future__ import annotations

import re
from typing import Callable, NamedTuple

_TAG_MAX = 10

# Нормализация для фильтра и дедупа
_TAG_BLACKLIST = frozenset(
    {
        "новость",
        "новости",
        "новостей",
        "новостями",
        "tg-export",
        "tgexport",
        "tg_export",
        "периферия",
        "гаджеты",
        "гаджет",
        "железо",
        "техника",
        "рынок",
        "it",
    }
)

_STOPWORDS = frozenset(
    """
    и в во на с со по к у из за над под без для при про что как это так а но или же ли бы
    мы вы они не да уже ещё только есть был будет если то от до все те та то примерно около
    ещё уже вот там тут кто чем при этом однако также ведь же лишь ещё поэтому где когда
    the a an with for from and or but in on at to of is are was were be been this that
    these those it its we you he she they them not no yes also just very more most some
    any out up off new all any both each few other such than too very can could should
    would will may might must shall about into through during before after above below
    between under again further then once here there when where why how both each few
    more most other some such than too very can just should now your our their its
    available mar pm am pdt pst est gmt utc
    """.split()
)


class TagRule(NamedTuple):
    pattern: re.Pattern[str]
    label: str
    score: int


def _rules() -> list[TagRule]:
    raw: list[tuple[str, str, int]] = [
        (r"\bG[- ]?Wolves\b", "G-Wolves", 100),
        (r"\bLycan\b", "Lycan", 98),
        (r"\bMCHOSE\b", "MCHOSE", 100),
        (r"\bRazer\b", "Razer", 100),
        (r"\bLogitech\b", "Logitech", 100),
        (r"\bCorsair\b", "Corsair", 100),
        (r"\bSteelSeries\b", "SteelSeries", 100),
        (r"\bZowie\b", "Zowie", 100),
        (r"\bPulsar\b", "Pulsar", 100),
        (r"\bLamzu\b", "Lamzu", 100),
        (r"\bGateron\b", "Gateron", 100),
        (r"\bKailh\b", "Kailh", 100),
        (r"\bCherry\b", "Cherry", 100),
        (r"\bIQUNIX\b", "IQUNIX", 100),
        (r"\bASUS\b", "ASUS", 100),
        (r"\bROG\b", "ROG", 95),
        (r"\bMSI\b", "MSI", 100),
        (r"\bGigabyte\b", "Gigabyte", 100),
        (r"\bAORUS\b", "AORUS", 95),
        (r"\bEndgame\s+Gear\b", "Endgame Gear", 100),
        (r"\bEndgame\b", "Endgame", 98),
        (r"\bDucky\b", "Ducky", 100),
        (r"\bKeychron\b", "Keychron", 100),
        (r"\bTekkusai\b", "Tekkusai", 100),
        (r"\bReship\b", "Reship", 95),
        (r"\bWallhack\b", "Wallhack", 100),
        (r"\bGlorious\b", "Glorious", 100),
        (r"\bHyperX\b", "HyperX", 100),
        (r"\bRoccat\b", "Roccat", 100),
        (r"\bPwnage\b", "Pwnage", 100),
        (r"\bSylical\b", "Sylical", 100),
        (r"\bEvolast\b", "Evolast", 100),
        (r"\bAtomic\s+Keyboard\b", "Atomic Keyboard", 100),
        (r"\bAtomic\b", "Atomic", 95),
        (r"\bRandomfrankp\b", "Randomfrankp", 95),
        (r"\bBoardzy\b", "Boardzy", 95),
        (r"\bFinemax\b", "Finemax", 100),
        (r"\bTangzu\b", "Tangzu", 100),
        (r"\bTALONGAMES\b", "TALONGAMES", 100),
        (r"\bTalongames\b", "TALONGAMES", 100),
        (r"\bULTRAPAD\b", "ULTRAPAD", 98),
        (r"\bNARI\b", "NARI", 97),
        (r"\bINARI\b", "INARI", 97),
        (r"\bGlsswrks\b", "Glsswrks", 100),
        (r"\bSORA\b", "SORA", 96),
        (r"\bCARNAGE\b", "CARNAGE", 96),
        (r"\bOmron\b", "Omron", 98),
        (r"\bTTC\b", "TTC", 98),
        (r"\bNordic\b", "Nordic", 98),
        (r"\bimecoo\b", "imecoo", 100),
        (r"\bMoondrop\b", "Moondrop", 100),
        (r"\bMorkblade\b", "Morkblade", 100),
        (r"\bReject\s+Gear\b", "Reject Gear", 100),
        (r"\bWooting\b", "Wooting", 100),
        (r"\bFinalmouse\b", "Finalmouse", 100),
        (r"\bVGN\b", "VGN", 100),
        (r"\bVXE\b", "VXE", 100),
        (r"\bV3\b", "V3", 90),
        (r"\bVKontakte\b", "VKontakte", 90),
        (r"\bPMM\b", "PMM", 95),
        (r"\bUnusual\s+Way\b", "Unusual Way", 100),
        (r"\bCybershop\b", "Cybershop", 90),
        (r"\bOzon\b", "Ozon", 85),
        (r"\bMCU\b", "MCU", 93),
        (r"\bIEM\b", "IEM", 88),
        (r"\bDSP\b", "DSP", 86),
        (r"\bRGB\b", "RGB", 82),
        (r"\bклавиатур", "клавиатура", 72),
        (r"\bмыш(ь|ка|ки|ек|ью|ей|ам|ами)?\b", "мышь", 72),
        (r"\bнаушник", "наушники", 72),
        (r"\bгарнитур", "гарнитура", 72),
        (r"\bгеймпад", "геймпад", 72),
        (r"\bковрик", "коврик", 68),
        (r"\bковер", "ковер", 68),
        (r"\bткан", "ткань", 66),
        (r"\bстеклянн", "стекло", 66),
        (r"\bглайд", "глайды", 68),
        (r"\bсвитч", "свитчи", 72),
        (r"\bкейкап", "кейкапы", 72),
        (r"\bмонитор", "монитор", 68),
        (r"\bмикрофон", "микрофон", 68),
        (r"\bроутер", "роутер", 68),
        (r"\bSSD\b", "SSD", 75),
        (r"\bGPU\b", "GPU", 75),
        (r"\bRTX\b", "RTX", 78),
        (r"\bвидео\b", "видео", 70),
        (r"\bпромо[- ]?ролик", "промо-ролик", 71),
        (r"\bпромо\b", "промо", 69),
        (r"\bролик\b", "ролик", 69),
        (r"\bвидеокарт", "видеокарта", 70),
        (r"\bнакопител", "накопители", 68),
        (r"\bстеклопад", "стеклопад", 74),
        (r"\bхардпад", "хардпад", 74),
        (r"\bтолщин", "толщина", 66),
        (r"\bскоростн\w*\s+покрыти\w*", "скоростное покрытие", 68),
        (r"\bпокрыти\w*", "покрытие", 66),
        (r"\bсиликон", "силикон", 66),
        (r"\bоснова\b", "основа", 66),
        (r"\b(?:стекла|стекло|стеклом|стекле)\b", "стекло", 67),
        (r"\bмеханик", "механика", 70),
        (r"\bмагнитн", "магнитная клавиатура", 73),
        (r"\bWi-?Fi\b", "Wi‑Fi", 70),
        (r"\bBluetooth\b", "Bluetooth", 68),
        (r"\bзвук", "звук", 62),
        (r"\bаудио\b", "аудио", 62),
        (
            r"\b(?:"
            r"слив|слит|слил|слили|сливает|сливают|"
            r"слива|сливу|сливом|сливы|сливов|сливам|сливами|"
            r"утечка|утечки|утечке|утечку|утечкой|утечек|"
            r"лейк|leak|инсайд|инсайда|инсайды|инсайдер|insider"
            r")\b",
            "слив",
            71,
        ),
        (r"\bсенсор", "сенсор", 73),
        (r"\bsensor(?:s)?\b", "сенсор", 73),
        (r"\b(?:High-Performance|high-performance)\s+Sensor\b", "сенсор", 72),
        (r"\bконтроллер", "контроллер", 73),
        (r"\bcontrollers?\b", "контроллер", 73),
        (r"\bFlagship\s+MCU\b", "MCU", 92),
        (r"\b(?:микрик|микрики)\b", "микрики", 69),
        (r"\b(?:энкодер|encoder)\b", "энкодер", 69),
        (r"\b(?:донгл|dongle)\b", "донгл", 66),
        (r"\b(?:прошивк|firmware)\b", "прошивка", 65),
        (r"\b(?:polling|khz|гц|герц)\b", "частота опроса", 64),
        (r"\b(?:анбокс|unboxing|распаковк)\b", "анбоксинг", 68),
        (r"\b(?:коробк|бокс)\b", "коробка", 62),
        (r"\b(?:анонс|предзаказ|релиз)\b", "анонс", 60),
        (r"\bобновлен", "обновление", 68),
    ]
    return [TagRule(re.compile(p, re.IGNORECASE), label, sc) for p, label, sc in raw]


TAG_RULES = _rules()

_PAW_RE = re.compile(r"\b(PAW\d{3,4}(?:SE|PRO|MAX)?)\b", re.IGNORECASE)
_PMW_RE = re.compile(r"\b(PMW\d{3,5})\b", re.IGNORECASE)
_BS_RE = re.compile(r"\b(BS\d{2,4})\b", re.IGNORECASE)
_NRF_RE = re.compile(r"\b(nRF?\s*52840)\b", re.IGNORECASE)
_NRF52_RE = re.compile(r"\b(nRF?\s*52[0-9]{3})\b", re.IGNORECASE)
# Коды SP-005 / SP005 / sp-005 / va 007 — дефис, пробел или слитно; регистр префикса не важен
_PREFIX_HYPHEN_CODE_RE = re.compile(
    r"\b(SP|VA|CR)[- ]?(\d{2,4})\b",
    re.IGNORECASE,
)

# Токены из заголовка: модели вроде TALONGAMES / ULTRAPAD (ALL CAPS ≥4 букв)
_TOKEN_LATIN = re.compile(
    r"\b(?:"
    r"[A-Z]{2,}\d+[A-Z0-9]*|"
    r"[A-Z]{4,}(?![a-z])|"
    r"[A-Z][a-z]+(?:[-'][A-Za-z]+)*|"
    r"[a-z]+(?:[-'][a-z]+)+"
    r")\b"
)

def _tag_key(s: str) -> str:
    t = s.strip()
    if t.startswith("#"):
        t = t[1:]
    return t.casefold()


def _is_blocked(s: str) -> bool:
    k = _tag_key(s)
    return not k or k in _TAG_BLACKLIST


def _display_token(raw: str) -> str:
    raw = raw.strip()
    if not raw:
        return raw
    if re.search(r"[a-zA-Z]", raw) and not re.search(r"[а-яёА-ЯЁ]", raw):
        if "-" in raw or raw.isupper() or re.search(r"\d", raw):
            return raw[:40]
        return raw[:1].upper() + raw[1:].lower() if len(raw) > 1 else raw.upper()
    return raw[:1].upper() + raw[1:] if raw else raw


def _haystack_with_slug(title_line: str, plain_full: str, slug: str) -> str:
    slug_tail = re.sub(r"^\d+-", "", slug.strip())
    slug_spaced = re.sub(r"-+", " ", slug_tail)
    return f"{title_line}\n{slug_spaced}\n{plain_full}"


def _harvest_word_tokens(haystack: str, add: Callable[[str, int, int], None]) -> None:
    """Латинские токены (бренды/модели из заголовка без отдельного правила)."""
    pos_base = 0
    for para in haystack.split("\n"):
        for m in _TOKEN_LATIN.finditer(para):
            w = m.group(0).strip()
            if len(w) < 3 or _tag_key(w) in _STOPWORDS:
                continue
            if _is_blocked(w):
                continue
            if _PREFIX_HYPHEN_CODE_RE.fullmatch(w):
                continue
            add(_display_token(w), 44, pos_base + m.start())
        pos_base += len(para) + 1


def build_news_tags(
    plain_full: str,
    title_line: str,
    raw_hashtags: list[str],
    slug: str = "",
    *,
    has_video: bool = False,
) -> list[str]:
    """
    До **10** тегов из текста/slug. `has_video` — в экспорте Telegram, если в посте есть
    видеофайл, всегда добавляется тег «видео».
    """
    haystack = _haystack_with_slug(title_line, plain_full, slug)
    best: dict[str, tuple[str, int, int]] = {}

    def add(tag: str, score: int, pos: int) -> None:
        tag = tag.strip()
        if _is_blocked(tag):
            return
        k = _tag_key(tag)
        if k not in best or score > best[k][1] or (
            score == best[k][1] and pos < best[k][2]
        ):
            best[k] = (tag, score, pos)

    if has_video:
        add("видео", 99, 0)

    for h in raw_hashtags:
        piece = h.strip()
        raw = piece[1:] if piece.startswith("#") else piece
        pos = haystack.find(piece)
        if pos < 0:
            pos = haystack.lower().find(raw.lower())
        if pos < 0:
            pos = 10**9
        add(raw, 84, pos)

    for rule in TAG_RULES:
        m = rule.pattern.search(haystack)
        if m:
            add(rule.label, rule.score, m.start())

    for m in _PAW_RE.finditer(haystack):
        add(m.group(1).upper(), 96, m.start())

    for m in _PMW_RE.finditer(haystack):
        add(m.group(1).upper(), 95, m.start())

    for m in _BS_RE.finditer(haystack):
        add(m.group(1).upper(), 92, m.start())

    for m in _NRF_RE.finditer(haystack):
        add("nRF52840", 96, m.start())

    for m in _NRF52_RE.finditer(haystack):
        compact = re.sub(r"\s+", "", m.group(1), flags=re.IGNORECASE)
        digits = re.sub(r"\D", "", compact)
        if digits == "52840":
            continue
        if len(digits) == 5 and digits.startswith("52"):
            add(f"nRF{digits}", 94, m.start())

    for m in _PREFIX_HYPHEN_CODE_RE.finditer(haystack):
        add(f"{m.group(1).upper()}-{m.group(2)}", 95, m.start())

    _harvest_word_tokens(haystack, add)

    # До сортировки: убрать ложные срабатывания
    if re.search(r"форма\s+steelseries?\s+prime", haystack, re.IGNORECASE):
        best.pop(_tag_key("SteelSeries"), None)
        best.pop(_tag_key("Prime"), None)
    if any(_tag_key(v[0]) == "магнитная клавиатура" for v in best.values()):
        best.pop(_tag_key("клавиатура"), None)

    ordered = sorted(best.values(), key=lambda x: (-x[1], x[2]))
    out: list[str] = []
    seen: set[str] = set()
    for _disp, _sc, _ in ordered:
        if len(out) >= _TAG_MAX:
            break
        k = _tag_key(_disp)
        if k in seen:
            continue
        seen.add(k)
        out.append(_disp)

    return out[:_TAG_MAX]
