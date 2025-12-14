import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeHtml } from "../../../escape-html.ts";
import { botText, getRepoHashtag, getUser } from "./_utils.ts";

export const pullRequestOpenedCallback: HandlerFunction<"pull_request.opened", unknown> = async (event) => {
  const user = await getUser(event.payload.sender);
  const pr = event.payload.pull_request;
  const repoHashtag = getRepoHashtag(event.payload.repository.name);

  await bot.announce(
    botText("e_pull_request_opened", {
      prTitle: escapeHtml(pr.title),
      user: escapeHtml(user.user),
      userUrl: escapeHtml(user.userUrl),
      prUrl: escapeHtml(pr.html_url),
      repoHashtag: escapeHtml(repoHashtag),
    }),
    { link_preview_options: { prefer_small_media: true, url: pr.html_url } },
  );
};
