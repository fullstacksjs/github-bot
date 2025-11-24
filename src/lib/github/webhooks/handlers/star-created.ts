import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeMarkdown } from "../../../escape-markdown.ts";
import { botText, getRepoHashtag, getUser, isRepositoryAccepted } from "./_utils.ts";

export const starCreatedCallback: HandlerFunction<"star.created", unknown> = async (event) => {
  if (!(await isRepositoryAccepted(event.payload.repository.full_name))) return;

  const user = await getUser(event.payload.sender);
  const githubUrl = event.payload.sender.html_url;
  const repo = event.payload.repository;
  const repoHashtag = getRepoHashtag(repo.full_name);

  await bot.announce(
    botText("e_star_created", {
      user: escapeMarkdown(user.user),
      userUrl: escapeMarkdown(githubUrl),
      repoName: escapeMarkdown(repo.full_name),
      repoUrl: escapeMarkdown(repo.html_url),
      repoHashtag,
    }),
    { link_preview_options: { prefer_small_media: true, url: githubUrl } },
  );
};
