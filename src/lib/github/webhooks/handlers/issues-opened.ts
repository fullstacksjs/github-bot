import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeHtml } from "../../../escape-html.ts";
import { botText, getRepoHashtag, getUser } from "./_utils.ts";

export const issuesOpenedCallback: HandlerFunction<"issues.opened", unknown> = async (event) => {
  const user = await getUser(event.payload.sender);
  const issue = event.payload.issue;
  const repoHashtag = getRepoHashtag(event.payload.repository.name);

  await bot.announce(
    botText("e_issue_opened", {
      issueTitle: escapeHtml(issue.title),
      user: escapeHtml(user.user),
      userUrl: escapeHtml(user.userUrl),
      issueUrl: escapeHtml(issue.html_url),
      repoHashtag: escapeHtml(repoHashtag),
    }),
    { link_preview_options: { prefer_small_media: true, url: issue.html_url } },
  );
};
