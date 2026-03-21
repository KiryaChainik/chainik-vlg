"""Теги новостей из текста (python3 -m unittest tg_export_tags_test из vlg-parser/)."""

import unittest

from news_tag_rules import build_news_tags
from tg_export import extract_hashtags


class TestBuildNewsTags(unittest.TestCase):
    def test_sparse_text_few_or_no_tags(self) -> None:
        plain = "⚡ Что-то про железо без имён"
        title = "Короткий заголовок"
        tags = build_news_tags(plain, title, extract_hashtags(plain))
        self.assertLessEqual(len(tags), 10)
        for bad in ("периферия", "гаджеты", "железо", "техника", "рынок", "IT"):
            self.assertNotIn(bad, tags)

    def test_rich_post_many_tags(self) -> None:
        plain = (
            "⚡ Утечка фото\n"
            "сенсор PAW3950, контроллер nRF52833\n"
            "микрики"
        )
        title = "слив"
        tags = build_news_tags(plain, title, extract_hashtags(plain))
        self.assertLessEqual(len(tags), 10)
        self.assertGreaterEqual(len(tags), 4)
        self.assertIn("слив", tags)
        self.assertIn("сенсор", tags)
        self.assertIn("контроллер", tags)
        self.assertIn("PAW3950", tags)

    def test_mchose_and_category(self) -> None:
        plain = "⚡ MCHOSE Ace 68 v2\nМеханическая клавиатура"
        title = "MCHOSE Ace 68 v2"
        tags = build_news_tags(plain, title, extract_hashtags(plain))
        self.assertIn("MCHOSE", tags)
        self.assertNotIn("новости", tags)
        self.assertNotIn("новость", tags)

    def test_hashtag_blocked_news(self) -> None:
        plain = "⚡ #новости #Razer анонс"
        title = "тест"
        tags = build_news_tags(plain, title, extract_hashtags(plain))
        self.assertNotIn("новости", tags)
        self.assertIn("Razer", tags)

    def test_paw_sensor(self) -> None:
        plain = "⚡ Новинка с сенсором PAW3950 и Nordic nRF52840"
        title = "PAW3950"
        tags = build_news_tags(plain, title, extract_hashtags(plain))
        self.assertIn("PAW3950", tags)
        self.assertIn("nRF52840", tags)

    def test_no_tg_export_tag(self) -> None:
        plain = "⚡ Экспорт tg-export в архив"
        title = "tg-export"
        tags = build_news_tags(plain, title, extract_hashtags(plain))
        keys = {t.casefold() for t in tags}
        self.assertNotIn("tg-export", keys)
        self.assertNotIn("tgexport", keys)

    def test_steelseries_forma_prime_not_brand_tag(self) -> None:
        plain = (
            "⚡ Новая мышь\n\nФорма Steelseries Prime\n⚙️ PAW3950"
        )
        title = "мышь"
        tags = build_news_tags(plain, title, extract_hashtags(plain))
        self.assertNotIn("SteelSeries", tags)
        self.assertIn("PAW3950", tags)

    def test_magnetic_keyboard_dedupes_generic_keyboard(self) -> None:
        plain = "⚡ Новая магнитная клавиатура IPI"
        title = "клава"
        tags = build_news_tags(plain, title, extract_hashtags(plain))
        self.assertIn("магнитная клавиатура", tags)
        self.assertNotIn("клавиатура", tags)

    def test_leak_stem_variants(self) -> None:
        for body in (
            "⚡ Слит рендер с завода",
            "⚡ Утечка спецификаций",
            "⚡ Инсайдер слил фото коробки",
        ):
            tags = build_news_tags(body, "x", extract_hashtags(body))
            self.assertIn("слив", tags, msg=body)

    def test_wallhack_sp_codes_sora_carnage(self) -> None:
        plain = (
            "⚡ Стилевый промо-ролик Wallhack SP-005 SORA CARNAGE\n"
            "Упоминание SP-004, VA-005 и CR 006 в тексте"
        )
        title = "Wallhack SP-005 SORA CARNAGE"
        tags = build_news_tags(plain, title, [])
        self.assertIn("SP-005", tags)
        self.assertIn("SP-004", tags)
        self.assertIn("VA-005", tags)
        self.assertIn("CR-006", tags)
        self.assertIn("SORA", tags)
        self.assertIn("CARNAGE", tags)
        self.assertIn("Wallhack", tags)

    def test_prefix_codes_compact_and_lowercase(self) -> None:
        """Слитно (SP005), строчные префиксы (sp-004, cr008) — в тегах нормализованный вид SP-005."""
        plain = "Патчи SP005 VA007 cr008, sp-004 и va 009"
        tags = build_news_tags(plain, "x", [])
        self.assertIn("SP-005", tags)
        self.assertIn("VA-007", tags)
        self.assertIn("CR-008", tags)
        self.assertIn("SP-004", tags)
        self.assertIn("VA-009", tags)
        self.assertNotIn("SP005", tags)
        self.assertNotIn("cr008", tags)

    def test_mchose_update_tag(self) -> None:
        plain = "⚡ Нас ожидает обновление MCHOSE Ace 68 v2\nК несчастью, пока без подробностей"
        title = "Нас ожидает обновление MCHOSE Ace 68 v2"
        tags = build_news_tags(plain, title, [])
        self.assertIn("обновление", tags)
        self.assertIn("MCHOSE", tags)

    def test_pmm_carpet_glass_fabric(self) -> None:
        plain = (
            "⚡ PMM выпустит ковер на манер FINALMOUSE\n"
            "Ковер будет иметь стеклянную основу, но поверхность из ткани"
        )
        title = "PMM выпустит ковер на манер FINALMOUSE"
        tags = build_news_tags(plain, title, [])
        self.assertIn("PMM", tags)
        self.assertIn("Finalmouse", tags)
        self.assertIn("ковер", tags)
        self.assertIn("ткань", tags)
        self.assertIn("стекло", tags)

    def test_vxe_v3_promo_rolik(self) -> None:
        plain = "⚡ Промо-ролик VXE V3"
        title = "Промо-ролик VXE V3"
        tags = build_news_tags(plain, title, [])
        self.assertIn("VXE", tags)
        self.assertIn("V3", tags)
        self.assertIn("промо", tags)
        self.assertIn("ролик", tags)
        self.assertIn("промо-ролик", tags)

    def test_has_video_adds_video_tag(self) -> None:
        tags = build_news_tags("⚡ Текст без слова видео", "заголовок", [], has_video=True)
        self.assertIn("видео", tags)

    def test_talongames_ultrapad_nari_glasspad(self) -> None:
        plain = (
            "⚡ TALONGAMES ULTRAPAD NARI – новый стеклопад\n"
            "Толщина стекла 1мм\n"
            "Специальное скоростное покрытие\n"
            "Силиконовая основа"
        )
        title = "TALONGAMES ULTRAPAD NARI – новый стеклопад"
        tags = build_news_tags(plain, title, [], slug="123-talongames-ultrapad-nari")
        self.assertIn("TALONGAMES", tags)
        self.assertIn("ULTRAPAD", tags)
        self.assertIn("NARI", tags)
        self.assertIn("стеклопад", tags)
        self.assertIn("толщина", tags)
        self.assertIn("скоростное покрытие", tags)
        self.assertIn("силикон", tags)
        self.assertIn("основа", tags)
        self.assertIn("стекло", tags)

    def test_gwolves_lycan_mcu_sensor(self) -> None:
        plain = (
            "⚡ Видео с коробкой G-Wolves Lycan\n"
            "BS20 Flagship MCU\n"
            "PAW3395SE High-Performance Sensor"
        )
        title = "Видео с коробкой G-Wolves Lycan"
        tags = build_news_tags(plain, title, [], slug="123-video-g-wolves-lycan")
        self.assertGreaterEqual(len(tags), 4)
        self.assertLessEqual(len(tags), 10)
        self.assertIn("G-Wolves", tags)
        self.assertIn("Lycan", tags)
        self.assertIn("MCU", tags)
        self.assertIn("PAW3395SE", tags)


if __name__ == "__main__":
    unittest.main()
