import type { EmitterWebhookEventName, HandlerFunction } from "@octokit/webhooks/types";

import { Webhooks } from "@octokit/webhooks";
import { config } from "#config";
import { githubLogger } from "#logger";

import { commentCreatedCallback } from "./handlers/comment-created.ts";
import { issuesAssignedCallback } from "./handlers/issues-assigned.ts";
import { issuesOpenedCallback } from "./handlers/issues-opened.ts";
import { projectItemEditedCallback } from "./handlers/projects-item-edited.ts";
import { pullRequestClosedCallback } from "./handlers/pull-request-closed.ts";
import { pullRequestOpenedCallback } from "./handlers/pull-request-opened.ts";
import { releaseCreatedCallback } from "./handlers/release-created.ts";
import { repositoryCreatedCallback } from "./handlers/repository-created.ts";
import { starCreatedCallback } from "./handlers/star-created.ts";
import { reportWebhookError } from "./report.ts";
import { withGuards } from "./withGuards.ts";

export const webhooks = new Webhooks({ secret: config.github.webhookSecret });

interface AnyPayload {
  action?: string;
  repository?: { full_name?: string };
  sender?: { login?: string };
}

const handledEvents = new Set<string>();

function handle<TEvent extends EmitterWebhookEventName>(event: TEvent, callback: HandlerFunction<TEvent, unknown>) {
  handledEvents.add(event);
  webhooks.on(event, callback);
}

webhooks.onAny(({ id, name, payload }) => {
  const { action, repository, sender } = payload as AnyPayload;
  const event = action ? `${name}.${action}` : name;
  const level = handledEvents.has(event) ? "debug" : "info";

  githubLogger[level](
    {
      deliveryId: id,
      event,
      repo: repository?.full_name,
      sender: sender?.login,
      tags: ["webhook"],
    },
    "webhook received",
  );
});

handle("issues.assigned", withGuards(issuesAssignedCallback));
handle("issues.opened", withGuards(issuesOpenedCallback));
handle("pull_request.closed", withGuards(pullRequestClosedCallback));
handle("pull_request.opened", withGuards(pullRequestOpenedCallback));
handle("release.created", withGuards(releaseCreatedCallback));
handle("repository.created", withGuards(repositoryCreatedCallback));
handle("star.created", withGuards(starCreatedCallback));
handle("issue_comment.created", withGuards(commentCreatedCallback));
handle("pull_request_review_comment.created", withGuards(commentCreatedCallback));
handle("projects_v2_item.edited", withGuards(projectItemEditedCallback, { skipRepositoryCheck: true }));
webhooks.onError(reportWebhookError);
