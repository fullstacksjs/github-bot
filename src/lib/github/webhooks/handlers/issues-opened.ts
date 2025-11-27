import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeMarkdown } from "../../../escape-markdown.ts";
import { botText, getRepoHashtag, getUser } from "./_utils.ts";

export const issuesOpenedCallback: HandlerFunction<"issues.opened", unknown> = async (event) => {
  const user = await getUser(event.payload.sender);
  const issue = event.payload.issue;
  const repoHashtag = getRepoHashtag(event.payload.repository.name);

  await bot.announce(
    botText("e_issue_opened", {
      issueTitle: escapeMarkdown(issue.title),
      user: escapeMarkdown(user.user),
      userUrl: escapeMarkdown(user.userUrl),
      issueUrl: escapeMarkdown(issue.html_url),
      repoHashtag: escapeMarkdown(repoHashtag),
    }),
    { link_preview_options: { prefer_small_media: true, url: issue.html_url } },
  );
};
