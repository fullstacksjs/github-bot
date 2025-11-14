import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "@/bot";

import { escapeMarkdown } from "../../escape-markdown";
import { botText, isRepositoryAccepted } from "./_utils";

export const releaseCreatedCallback: HandlerFunction<"release.created", unknown> = async (event) => {
  if (!(await isRepositoryAccepted(event.payload.repository.full_name))) return;

  const repo = event.payload.repository;
  const release = event.payload.release;

  await bot.announce(
    botText("e_release_created", {
      repoName: escapeMarkdown(repo.full_name),
      releaseTag: escapeMarkdown(release.tag_name),
      releaseUrl: escapeMarkdown(release.html_url),
    }),
  );
};
