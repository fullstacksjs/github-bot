import { crlfToLf, isNullOrEmptyString } from "@fullstacksjs/toolbox";

const boldPattern = /\*\*(.+?)\*\*/g;
const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
const githubPullPattern = /(?<!["=])(https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/(\d+))(?!<)/g;
const githubComparePattern = /(?<!["=])(https:\/\/github\.com\/[^/]+\/[^/]+\/compare\/(\S+))(?!<)/g;

function renderInline(content: string): string {
  return content
    .replace(boldPattern, "<b>$1</b>")
    .replace(linkPattern, '<a href="$2">$1</a>')
    .replace(githubPullPattern, '<a href="$1">[$2]</a>')
    .replace(githubComparePattern, '<a href="$1">[$2]</a>');
}

export function renderMarkdown(markdown: string, maxChars: number = Infinity): string {
  const lines = crlfToLf(markdown)
    .split("\n")
    .map((l) => l.trim());

  const rendered: string[] = [];
  let lastWasEmpty = true;

  for (const line of lines) {
    if (isNullOrEmptyString(line)) {
      if (!lastWasEmpty) rendered.push("");
      lastWasEmpty = true;
      continue;
    } else {
      lastWasEmpty = false;
    }

    const headingMatch = line.match(/^#{1,6}\s+(\S.*)$/);
    if (headingMatch) {
      const content = headingMatch[1];
      rendered.push(`<b>${renderInline(content.trim())}</b>`);
      continue;
    }

    const listMatch = line.match(/^\s*[*-]\s+(\S.*)$/);
    if (listMatch) {
      rendered.push(`• ${renderInline(listMatch[1].trim())}`);
      continue;
    }

    rendered.push(renderInline(line));
  }

  let html = "";
  for (const line of rendered) {
    if (html.length > maxChars) {
      return `${html}...`;
    }
    html += `${line}\n`;
  }

  return html.trim();
}
