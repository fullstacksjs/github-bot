import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";
import { renderMarkdown } from "#telegram";

import { escapeHtml } from "../../../escape-html.ts";
import { botText, getRepoHashtag } from "./_utils.ts";

export const releaseCreatedCallback: HandlerFunction<"release.created", unknown> = async (event) => {
  const repo = event.payload.repository;
  const release = event.payload.release;
  const repoHashtag = getRepoHashtag(repo.name);

  if (release.body) {
    const notes = renderMarkdown(release.body);

    await bot.announce(
      botText("e_release_created_with_notes", {
        repoName: escapeHtml(repo.name),
        releaseTag: escapeHtml(release.tag_name),
        releaseUrl: escapeHtml(release.html_url),
        notes,
        repoHashtag,
      }),
      { link_preview_options: { prefer_small_media: true, url: release.html_url } },
    );
  } else {
    await bot.announce(
      botText("e_release_created", {
        repoName: escapeHtml(repo.name),
        releaseTag: escapeHtml(release.tag_name),
        releaseUrl: escapeHtml(release.html_url),
        repoHashtag,
      }),
      { link_preview_options: { prefer_small_media: true, url: release.html_url } },
    );
  }
};
