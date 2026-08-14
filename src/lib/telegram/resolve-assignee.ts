import { db } from "#db";

import { escapeHtml } from "../escape-html.ts";

export async function resolveAssignee(login: string, htmlUrl: string): Promise<string> {
  const contributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.ghUsername, login),
  });

  let tgStatus: string;
  if (contributor?.tgUsername) {
    tgStatus = `(@${escapeHtml(contributor.tgUsername)})`;
  } else if (contributor?.tgName && contributor?.tgId) {
    tgStatus = `(<a href="tg://user?id=${contributor.tgId}">${escapeHtml(contributor.tgName)}</a>)`;
  } else if (contributor?.tgId) {
    tgStatus = `(<a href="tg://user?id=${contributor.tgId}">-</a>)`;
  } else {
    tgStatus = "(-)";
  }

  return `<a href="${escapeHtml(htmlUrl)}">${escapeHtml(login)}</a> ${tgStatus}`;
}
