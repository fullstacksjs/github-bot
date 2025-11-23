import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeMarkdown } from "../../../escape-markdown.ts";
import { botText, getUser, isRepositoryAccepted } from "./_utils.ts";

export const pullRequestClosedCallback: HandlerFunction<"pull_request.closed", unknown> = async (event) => {
  if (!(await isRepositoryAccepted(event.payload.repository.full_name))) return;
  if (!event.payload.pull_request.merged) return;

  const user = await getUser(event.payload.sender);
  const pr = event.payload.pull_request;

  await bot.announce(
    botText("e_pull_request_closed_merged", {
      user: escapeMarkdown(user.user),
      userUrl: escapeMarkdown(user.userUrl),
      prUrl: escapeMarkdown(pr.html_url),
    }),
    { link_preview_options: { prefer_small_media: true, url: pr.html_url } },
  );
};
