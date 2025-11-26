import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeMarkdown } from "../../../escape-markdown.ts";
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
  const repoHashtag = getRepoHashtag(event.payload.repository.full_name);

  await bot.announce(
    botText("e_issue_assigned", {
      issueTitle: escapeMarkdown(issue.title),
      assignee: escapeMarkdown(assignee.user),
      assigneeUrl: escapeMarkdown(assignee.userUrl),
      issueUrl: escapeMarkdown(issue.html_url),
      repoHashtag: escapeMarkdown(repoHashtag),
    }),
    { link_preview_options: { prefer_small_media: true, url: issue.html_url } },
  );
};
