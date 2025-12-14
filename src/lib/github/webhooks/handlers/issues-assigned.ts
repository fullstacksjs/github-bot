import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeHtml } from "../../../escape-html.ts";
import { botText, getRepoHashtag, getUser } from "./_utils.ts";

export const issuesAssignedCallback: HandlerFunction<"issues.assigned", unknown> = async (event) => {
  const assigneeData = event.payload.assignee;
  if (!assigneeData?.html_url || !assigneeData?.login) return;

  const assignee = await getUser({
    html_url: assigneeData.html_url,
    login: assigneeData.login,
    name: assigneeData.name ?? null,
  });
  const issue = event.payload.issue;
  const repoHashtag = getRepoHashtag(event.payload.repository.name);

  await bot.announce(
    botText("e_issue_assigned", {
      issueTitle: escapeHtml(issue.title),
      assignee: escapeHtml(assignee.user),
      assigneeUrl: assignee.userUrl,
      issueUrl: issue.html_url,
      repoHashtag: escapeHtml(repoHashtag),
    }),
    { link_preview_options: { prefer_small_media: true, url: issue.html_url } },
  );
};
