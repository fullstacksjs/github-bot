import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "@/bot";

import type { Reviewer, User, ValidReviewer } from "./_utils";

import { escapeMarkdown } from "../../escape-markdown";
import { botText, getUser, isRepositoryAccepted } from "./_utils";

function isValidReviewer(r: Reviewer): r is ValidReviewer {
  return !!r && "login" in r && typeof r.login === "string";
}

async function getReviewers(reviewers: Reviewer[]): Promise<User[]> {
  return Promise.all(reviewers.filter(isValidReviewer).map(getUser));
}

export const pullRequestReviewRequestedCallback: HandlerFunction<"pull_request.review_requested", unknown> = async (
  event,
) => {
  const repo = event.payload.repository.full_name;
  if (!(await isRepositoryAccepted(repo))) return;

  const requester = await getUser(event.payload.sender);
  const reviewers = await getReviewers(event.payload.pull_request.requested_reviewers);
  const pr = event.payload.pull_request;

  const reviewersText = reviewers
    .map((r) =>
      botText("e_pull_request_reviewer", { reviewer: escapeMarkdown(r.user), reviewerUrl: escapeMarkdown(r.userUrl) }),
    )
    .join("\n");

  await bot.announce(
    botText("e_pull_request_review_requested", {
      requester: escapeMarkdown(requester.user),
      requesterUrl: escapeMarkdown(requester.userUrl),
      prUrl: escapeMarkdown(pr.html_url),
      reviewers: reviewersText,
    }),
  );
};
