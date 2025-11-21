import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "@/bot";

import { escapeMarkdown } from "../../escape-markdown";
import { botText, getUser, isRepositoryAccepted } from "./_utils";

export const starCreatedCallback: HandlerFunction<"star.created", unknown> = async (event) => {
  if (!(await isRepositoryAccepted(event.payload.repository.full_name))) return;

  const user = await getUser(event.payload.sender);
  const repo = event.payload.repository;

  await bot.announce(
    botText("e_star_created", {
      user: escapeMarkdown(user.user),
      userUrl: escapeMarkdown(user.userUrl),
      repoName: escapeMarkdown(repo.full_name),
      repoUrl: escapeMarkdown(repo.html_url),
    }),
    { link_preview_options: { prefer_small_media: true, url: user.userUrl } },
  );
};
