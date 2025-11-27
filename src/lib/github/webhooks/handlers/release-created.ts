import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeMarkdown } from "../../../escape-markdown.ts";
import { botText, getRepoHashtag } from "./_utils.ts";

export const releaseCreatedCallback: HandlerFunction<"release.created", unknown> = async (event) => {
  const repo = event.payload.repository;
  const release = event.payload.release;
  const repoHashtag = getRepoHashtag(repo.name);

  await bot.announce(
    botText("e_release_created", {
      repoName: escapeMarkdown(repo.name),
      releaseTag: escapeMarkdown(release.tag_name),
      releaseUrl: escapeMarkdown(release.html_url),
      repoHashtag: escapeMarkdown(repoHashtag),
    }),
    { link_preview_options: { prefer_small_media: true, url: release.html_url } },
  );
};
