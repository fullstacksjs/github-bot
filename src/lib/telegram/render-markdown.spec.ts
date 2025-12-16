import { expect, test } from "vitest";

import { renderMarkdown } from "./render-markdown.ts";

test("should render raw text", () => {
  const markdown = "This is a simple text without any markdown.";

  expect(renderMarkdown(markdown)).toBe(markdown);
});

test("should trim leading and trailing whitespace", () => {
  const markdown = "\n\n   \n\nThis is a text with leading and trailing spaces.\n   \n  ";
  const expected = "This is a text with leading and trailing spaces.";

  expect(renderMarkdown(markdown)).toBe(expected);
});

test("should render bold text", () => {
  const markdown = "This is **bold** text.";
  const expected = "This is <b>bold</b> text.";

  expect(renderMarkdown(markdown)).toBe(expected);
});

test("should render links", () => {
  const markdown = "This is a [link](https://example.com).";
  const expected = 'This is a <a href="https://example.com">link</a>.';

  expect(renderMarkdown(markdown)).toBe(expected);
});

test("should render headings", () => {
  const markdown = "# Heading 1\n## Heading 2\n### Heading 3";
  const expected = "<b>Heading 1</b>\n<b>Heading 2</b>\n<b>Heading 3</b>";

  expect(renderMarkdown(markdown)).toBe(expected);
});

test("should render bullet points", () => {
  const markdown = "- Item 1\n- Item 2\n- Item 3";
  const expected = "• Item 1\n• Item 2\n• Item 3";

  expect(renderMarkdown(markdown)).toBe(expected);
});

test("should merge multiple empty lines", () => {
  const markdown = "Line 1\n\n\n\nLine 2";
  const expected = "Line 1\n\nLine 2";

  expect(renderMarkdown(markdown)).toBe(expected);
});

test("should render markdown to HTML", () => {
  const markdown = [
    "",
    "# [13.12.0](https://github.com/fullstacksjs/eslint-config/compare/v13.11.2...v13.12.0) (2025-12-16)",
    "",
    "",
    "### Bug Fixes",
    "",
    "* **stylistic:** fix error in rule lines-between-class-members, add new rule ([411160c](https://github.com/fullstacksjs/eslint-config/commit/411160c7f900e6417f32c671d00e8e949ca3e445))",
    "* **stylistic:** fix padding-line-between-statements to be more general ([956e745](https://github.com/fullstacksjs/eslint-config/commit/956e745027bfc6025554e138d2b9084e3749178b))",
    "* **stylistic:** fix rule name padding-line-between-statements ([d509bec](https://github.com/fullstacksjs/eslint-config/commit/d509bec4c915c6df6a486f54b2a4c486fa40702c))",
    "",
    "",
    "### Features",
    "",
    "* **stylistic:** add new rules ([2283711](https://github.com/fullstacksjs/eslint-config/commit/228371129db44b128ef5e733b9f477983f4f4509))",
    "* **stylistic:** fix padding-line-between-statements and add new rule lines-between-class-members ([5c573f8](https://github.com/fullstacksjs/eslint-config/commit/5c573f89d522b9aeb4a11e654ccb224f93076094))",
  ].join("\n");

  const expected = [
    '<b><a href="https://github.com/fullstacksjs/eslint-config/compare/v13.11.2...v13.12.0">13.12.0</a> (2025-12-16)</b>',
    "",
    "<b>Bug Fixes</b>",
    "",
    '• <b>stylistic:</b> fix error in rule lines-between-class-members, add new rule (<a href="https://github.com/fullstacksjs/eslint-config/commit/411160c7f900e6417f32c671d00e8e949ca3e445">411160c</a>)',
    '• <b>stylistic:</b> fix padding-line-between-statements to be more general (<a href="https://github.com/fullstacksjs/eslint-config/commit/956e745027bfc6025554e138d2b9084e3749178b">956e745</a>)',
    '• <b>stylistic:</b> fix rule name padding-line-between-statements (<a href="https://github.com/fullstacksjs/eslint-config/commit/d509bec4c915c6df6a486f54b2a4c486fa40702c">d509bec</a>)',
    "",
    "<b>Features</b>",
    "",
    '• <b>stylistic:</b> add new rules (<a href="https://github.com/fullstacksjs/eslint-config/commit/228371129db44b128ef5e733b9f477983f4f4509">2283711</a>)',
    '• <b>stylistic:</b> fix padding-line-between-statements and add new rule lines-between-class-members (<a href="https://github.com/fullstacksjs/eslint-config/commit/5c573f89d522b9aeb4a11e654ccb224f93076094">5c573f8</a>)',
  ].join("\n");

  expect(renderMarkdown(markdown)).toBe(expected);
});

test("should truncate output exceeding max characters", () => {
  const longText = "1\n3\n5\n6\n8\n";
  const rendered = renderMarkdown(longText, 5);
  const expected = "1\n3\n5\n...";

  expect(rendered).toBe(expected);
});

test("should keep the line when truncating output exceeding max characters", () => {
  const longText = "First line\nSecond line\nThird line\nFourth line\nFifth line\n";
  const rendered = renderMarkdown(longText, 15);
  const expected = "First line\nSecond line\n...";

  expect(rendered).toBe(expected);
});

test("should not add extra newline when truncating at the end of a line", () => {
  const longText = ["Line one", "Line two", "Line three"].join("\n");
  const rendered = renderMarkdown(longText, longText.indexOf("Line two") + 1);
  const expected = "Line one\nLine two\n...";

  expect(rendered).toBe(expected);
});

test("should handle markdown links", () => {
  const markdown = [
    "What's Changed",
    "• feat: add logo by @ASafaeirad in https://github.com/fullstacksjs/github-bot/pull/87",
    "• feat: add license by @ASafaeirad in https://github.com/fullstacksjs/github-bot/pull/88",
    "• feat: add markdown renderer by @ASafaeirad in https://github.com/fullstacksjs/github-bot/pull/89",
    "",
    "Full Changelog: https://github.com/fullstacksjs/github-bot/compare/v1.0.6...v1.1.0",
  ].join("\n");
  const expected = [
    "What's Changed",
    '• feat: add logo by @ASafaeirad in <a href="https://github.com/fullstacksjs/github-bot/pull/87">[87]</a>',
    '• feat: add license by @ASafaeirad in <a href="https://github.com/fullstacksjs/github-bot/pull/88">[88]</a>',
    '• feat: add markdown renderer by @ASafaeirad in <a href="https://github.com/fullstacksjs/github-bot/pull/89">[89]</a>',
    "",
    'Full Changelog: <a href="https://github.com/fullstacksjs/github-bot/compare/v1.0.6...v1.1.0">[v1.0.6...v1.1.0]</a>',
  ].join("\n");

  expect(renderMarkdown(markdown)).toBe(expected);
});
