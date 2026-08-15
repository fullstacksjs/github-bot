import type { BotContext } from "#bot";

import { config } from "#config";
import { octokit } from "#github";
import { createCommand } from "#telegram";

import { escapeHtml } from "../../../lib/escape-html.ts";
import { mapWithConcurrency } from "../../../lib/github/map-with-concurrency.ts";
import { resolveAssignee } from "../../../lib/telegram/resolve-assignee.ts";

const REPO_CONCURRENCY = 5;
const ISSUE_CONCURRENCY = 10;

interface Section {
  text: string;
  count: number;
}

export async function issuelistHandler(ctx: BotContext) {
  const org = config.github.orgName;

  const repos = await octokit.paginate(octokit.rest.repos.listForOrg, {
    org,
    type: "public",
    per_page: 100,
  });

  const activeRepos = repos.filter((r) => !r.archived);

  // We cache the value as a Promise so concurrent requests are deduped too.
  const assigneeCache = new Map<string, Promise<string>>();
  const resolveAssigneeCached = (login: string, htmlUrl: string): Promise<string> => {
    let cached = assigneeCache.get(login);
    if (!cached) {
      cached = resolveAssignee(login, htmlUrl);
      assigneeCache.set(login, cached);
    }
    return cached;
  };

  const rawSections = await mapWithConcurrency(activeRepos, REPO_CONCURRENCY, async (repo): Promise<Section | null> => {
    const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
      owner: org,
      repo: repo.name,
      state: "open",
      per_page: 100,
    });

    const openIssues = issues.filter((i) => !i.pull_request);
    if (openIssues.length === 0) return null;

    const issueLines = await mapWithConcurrency(openIssues, ISSUE_CONCURRENCY, async (issue) => {
      const assigneeText = issue.assignee
        ? await resolveAssigneeCached(issue.assignee.login, issue.assignee.html_url)
        : ctx.t("cmd_issuelist_unassigned");

      return ctx.t("cmd_issuelist_issue", {
        emoji: "",
        issueUrl: escapeHtml(issue.html_url),
        issueTitle: escapeHtml(issue.title),
        assignee: assigneeText,
      });
    });

    return {
      text: `${ctx.t("cmd_issuelist_repo", { repoName: repo.name })}\n${issueLines.join("\n")}`,
      count: openIssues.length,
    };
  });

  const sections = rawSections.filter((s): s is Section => s !== null);

  if (sections.length === 0) {
    return await ctx.html.replyToMessage(ctx.t("cmd_issuelist_empty"));
  }

  const totalIssues = sections.reduce((acc, s) => acc + s.count, 0);

  const body = sections.map((s) => s.text).join("\n\n");
  return await ctx.html.replyToMessage(
    `${ctx.t("cmd_issuelist_header")}\n\n${body}\n\n${ctx.t("cmd_issuelist_total", { count: totalIssues })}`,
    { disable_notification: true },
  );
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
