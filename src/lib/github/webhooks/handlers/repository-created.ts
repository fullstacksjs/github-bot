import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";
import { db, schema } from "#db";

import { escapeHtml } from "../../../escape-html.ts";
import { botText, getRepoHashtag } from "./_utils.ts";

export const repositoryCreatedCallback: HandlerFunction<"repository.created", unknown> = async (event) => {
  const repo = event.payload.repository;
  const repoHashtag = getRepoHashtag(repo.name);

  await db
    .insert(schema.repositories)
    .values({ name: repo.full_name, htmlUrl: repo.html_url })
    .onConflictDoUpdate({
      target: [schema.repositories.name],
      set: { htmlUrl: repo.html_url, isBlacklisted: false },
    });

  await bot.announce(
    botText("e_repository_created", {
      repoName: escapeHtml(repo.name),
      repoUrl: escapeHtml(repo.html_url),
      repoHashtag: escapeHtml(repoHashtag),
    }),
    { link_preview_options: { prefer_small_media: true, url: repo.html_url } },
  );
};
