"""Проверки экранирования MDX (запуск: python3 -m unittest tg_export_escape_test из vlg-parser/)."""

import unittest

from tg_export import text_field_to_markdown


class TestMdxEscape(unittest.TestCase):
    def test_plain_angle_brackets_not_jsx(self) -> None:
        s = text_field_to_markdown(
            [{"type": "plain", "text": "на сайте <Eloshapes.com> есть"}]
        )
        self.assertIn("&lt;", s)
        self.assertIn("&gt;", s)
        self.assertNotIn("<Eloshapes", s)

    def test_plain_ampersand(self) -> None:
        s = text_field_to_markdown([{"type": "plain", "text": "A & B"}])
        self.assertIn("&amp;", s)

    def test_link_never_raw_angle_brackets(self) -> None:
        s = text_field_to_markdown(
            [
                {"type": "link", "text": "t.me/foo", "href": "t.me/foo"},
            ]
        )
        self.assertIn("[", s)
        self.assertIn("](", s)
        self.assertNotIn("<t.me", s)

    def test_bold_with_lt(self) -> None:
        s = text_field_to_markdown(
            [{"type": "bold", "text": "x <y> z"}],
        )
        self.assertIn("&lt;", s)
        self.assertIn("**", s)


if __name__ == "__main__":
    unittest.main()
