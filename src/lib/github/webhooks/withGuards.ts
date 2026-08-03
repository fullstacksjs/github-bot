import type { EmitterWebhookEvent, EmitterWebhookEventName, HandlerFunction } from "@octokit/webhooks/types";

import { githubLogger } from "#logger";

import { isRepositoryAccepted, isUserMuted } from "./handlers/_utils.ts";

/**
 * Wraps a GitHub webhook handler with common guards.
 *
 * This ensures that only events which meet certain conditions reach the handler:
 * - The event comes from an accepted repository (`isRepositoryAccepted` returns true).
 * - The user who triggered the event is not muted (`isUserMuted` returns false).
 *
 * Guards can be configured through the `options` parameter.
 *
 * @template TEvent - The GitHub webhook event name (e.g., "pull_request.opened").
 * @param handler - The original handler function to wrap.
 * @param options - Optional configuration for enabling or disabling specific guards.
 * @returns A new handler function that applies the configured guards before calling the original handler.
 *
 * @example
 * webhooks.on("pull_request.opened", withGuards(pullRequestOpenedCallback));
 *
 * @example
 * webhooks.on(
 *   "projects_v2_item.edited",
 *   withGuards(projectItemEditedCallback, {
 *     skipRepositoryCheck: true,
 *   }),
 * );
 */

interface GuardOptions {
  skipRepositoryCheck?: boolean;
}

export function withGuards<TEvent extends EmitterWebhookEventName>(
  handler: HandlerFunction<TEvent, unknown>,
  options: GuardOptions = {},
) {
  return async (event: EmitterWebhookEvent<TEvent>) => {
    const username = event.payload.sender?.login;
    const skipped = (reason: string, details: Record<string, unknown> = {}) => {
      githubLogger.debug({ deliveryId: event.id, event: event.name, reason, ...details }, "webhook skipped");
    };

    if (!options.skipRepositoryCheck) {
      if (!("repository" in event.payload)) return skipped("no_repository");

      const repo = event.payload.repository?.full_name;

      if (repo && !(await isRepositoryAccepted(repo))) {
        return skipped("repository_blacklisted", { repo });
      }
    }
    if (username && (await isUserMuted(username))) return skipped("user_muted", { sender: username });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return handler(event);
  };
}
