import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeHtml } from "../../../escape-html.ts";
import { botText, getRepoHashtag, getUser } from "./_utils.ts";

export const starCreatedCallback: HandlerFunction<"star.created", unknown> = async (event) => {
  const user = await getUser(event.payload.sender);
  const repo = event.payload.repository;
  const repoHashtag = getRepoHashtag(repo.name);

  await bot.announce(
    botText("e_star_created", {
      user: escapeHtml(user.ghDisplayname),
      userUrl: escapeHtml(user.ghProfileUrl),
      telegramStatus: user.telegramStatus,
      repoName: escapeHtml(repo.name),
      repoUrl: escapeHtml(repo.html_url),
      repoHashtag: escapeHtml(repoHashtag),
      starNumber: repo.stargazers_count,
    }),
    { link_preview_options: { prefer_small_media: true, url: user.ghProfileUrl } },
  );
};
