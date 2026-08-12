import { config } from "#config";
import { db } from "#db";
import { createCommand } from "#telegram";

import type { BotContext } from "../../bot.ts";

import { escapeHtml } from "../../../lib/escape-html.ts";
import { octokit } from "../../../lib/github/github.ts";

function getStatusEmoji(labels: (string | { name?: string | null })[]): string {
  const names = labels.map((l) => (typeof l === "string" ? l : (l.name ?? "")));
  if (names.includes("Todo")) return "📝 ";
  if (names.includes("In Progress")) return "🔄 ";
  return "";
}

async function resolveAssignee(login: string, htmlUrl: string): Promise<string> {
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

export async function issuelistHandler(ctx: BotContext) {
  const org = config.github.orgName;

  const { data: repos } = await octokit.rest.repos.listForOrg({
    org,
    type: "public",
    per_page: 100,
  });

  const activeRepos = repos.filter((r) => !r.archived);

  const sections = (
    await Promise.all(
      activeRepos.map(async (repo) => {
        const { data: issues } = await octokit.rest.issues.listForRepo({
          owner: org,
          repo: repo.name,
          state: "open",
          per_page: 100,
        });

        const openIssues = issues.filter((i) => !i.pull_request);
        if (openIssues.length === 0) return null;

        const issueLines = await Promise.all(
          openIssues.map(async (issue) => {
            const emoji = getStatusEmoji(issue.labels);
            const assigneeText = issue.assignee
              ? await resolveAssignee(issue.assignee.login, issue.assignee.html_url)
              : ctx.t("cmd_issuelist_unassigned");

            return ctx.t("cmd_issuelist_issue", {
              emoji,
              issueUrl: escapeHtml(issue.html_url),
              issueTitle: escapeHtml(issue.title),
              assignee: assigneeText,
            });
          }),
        );

        return `${ctx.t("cmd_issuelist_repo", { repoName: repo.name })}\n${issueLines.join("\n")}`;
      }),
    )
  ).filter(Boolean);

  if (sections.length === 0) {
    return await ctx.html.replyToMessage(ctx.t("cmd_issuelist_empty"));
  }

  return await ctx.html.replyToMessage(sections.join("\n\n"), {
    disable_notification: true,
  });
}

export const cmdIssuelist = createCommand({
  template: "issuelist",
  description: "List all open issues grouped by repository",
  handler: issuelistHandler,
  scopes: [
    { type: "chat", chat_id: config.bot.chatId },
    { type: "chat_administrators", chat_id: config.bot.chatId },
  ],
});
