import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";
import { db, schema } from "#db";

import { escapeMarkdown } from "../../../escape-markdown.ts";
import { botText, getRepoHashtag, isRepositoryAccepted } from "./_utils.ts";

export const repositoryCreatedCallback: HandlerFunction<"repository.created", unknown> = async (event) => {
  if (!(await isRepositoryAccepted(event.payload.repository.full_name))) return;

  const repo = event.payload.repository;
  const repoHashtag = getRepoHashtag(repo.full_name);

  await db
    .insert(schema.repositories)
    .values({ name: repo.full_name, htmlUrl: repo.html_url })
    .onConflictDoUpdate({
      target: [schema.repositories.name],
      set: { htmlUrl: repo.html_url, isBlacklisted: false },
    });

  await bot.announce(
    botText("e_repository_created", {
      repoName: escapeMarkdown(repo.full_name),
      repoUrl: escapeMarkdown(repo.html_url),
      repoHashtag,
    }),
    { link_preview_options: { prefer_small_media: true, url: repo.html_url } },
  );
};
