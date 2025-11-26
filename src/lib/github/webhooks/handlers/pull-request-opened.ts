import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeMarkdown } from "../../../escape-markdown.ts";
import { botText, getRepoHashtag, getUser } from "./_utils.ts";

export const pullRequestOpenedCallback: HandlerFunction<"pull_request.opened", unknown> = async (event) => {
  const user = await getUser(event.payload.sender);
  const pr = event.payload.pull_request;
  const repoHashtag = getRepoHashtag(event.payload.repository.full_name);

  await bot.announce(
    botText("e_pull_request_opened", {
      prTitle: escapeMarkdown(pr.title),
      user: escapeMarkdown(user.user),
      userUrl: escapeMarkdown(user.userUrl),
      prUrl: escapeMarkdown(pr.html_url),
      repoHashtag: escapeMarkdown(repoHashtag),
    }),
    { link_preview_options: { prefer_small_media: true, url: pr.html_url } },
  );
};
