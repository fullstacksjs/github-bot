import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "@/bot";

import { escapeMarkdown } from "../../escape-markdown";
import { botText, getReviewers, getUser, isRepositoryAccepted } from "./_utils";

export const pullRequestReviewRequestedCallback: HandlerFunction<"pull_request.review_requested", unknown> = async (
  event,
) => {
  const repo = event.payload.repository.full_name;
  if (!(await isRepositoryAccepted(repo))) return;

  const requester = await getUser(event.payload.sender);
  const reviewers = await getReviewers(event.payload.pull_request.requested_reviewers);
  const pr = event.payload.pull_request;

  const reviewersText = reviewers
    .map((r) => botText("e_reviewer", { reviewer: r.user, reviewerUrl: r.userUrl }))
    .join("\n");

  await bot.announce(
    botText("e_pull_request.review_requested", {
      requester: escapeMarkdown(requester.user),
      requesterUrl: escapeMarkdown(requester.userUrl),
      prUrl: escapeMarkdown(pr.html_url),
      reviewers: escapeMarkdown(reviewersText),
    }),
  );
};
