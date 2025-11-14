import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "@/bot";

import { escapeMarkdown } from "../../escape-markdown";
import { botText, getUser, isRepositoryAccepted } from "./_utils";

export const issuesOpenedCallback: HandlerFunction<"issues.opened", unknown> = async (event) => {
  if (!(await isRepositoryAccepted(event.payload.repository.full_name))) return;

  const user = await getUser(event.payload.sender);
  const issue = event.payload.issue;

  await bot.announce(
    botText("e_issue_opened", {
      issueTitle: escapeMarkdown(issue.title),
      user: escapeMarkdown(user.user),
      userUrl: escapeMarkdown(user.userUrl),
      issueUrl: escapeMarkdown(issue.html_url),
    }),
  );
};
