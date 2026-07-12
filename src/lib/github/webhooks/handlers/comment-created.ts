import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeHtml } from "../../../escape-html.ts";
import { botText, getRepoHashtag, getUser } from "./_utils.ts";

export const commentCreatedCallback: HandlerFunction<
  "issue_comment.created" | "pull_request_review_comment.created",
  unknown
> = async (event) => {
  const comment = event.payload.comment;
  const repository = event.payload.repository;
  const sender = event.payload.sender;

  const user = await getUser(sender);
  const repoHashtag = getRepoHashtag(repository.name);

  let title: string;
  let number: number;
  let type: "issue" | "pull_request";

  if ("issue" in event.payload) {
    const issue = event.payload.issue;
    title = issue.title;
    number = issue.number;
    type = "issue";
  } else if ("pull_request" in event.payload) {
    const pr = event.payload.pull_request;
    title = pr.title;
    number = pr.number;
    type = "pull_request";
  } else {
    return;
  }

  const commentLink = comment.html_url;
  const commentPreview = comment.body.length > 100 ? `${comment.body.substring(0, 100)}...` : comment.body;

  await bot.announce(
    botText("e_comment_created", {
      commentAuthor: escapeHtml(user.ghDisplayname),
      telegramStatus: user.telegramStatus,
      repoName: escapeHtml(repository.full_name),
      repoHashtag: escapeHtml(repoHashtag),
      title: escapeHtml(title),
      number: number.toString(),
      commentPreview: escapeHtml(commentPreview),
      commentLink: escapeHtml(commentLink),
      ghProfileUrl: escapeHtml(user.ghProfileUrl),
      type,
    }),
    { link_preview_options: { prefer_small_media: true, url: commentLink } },
  );
};
