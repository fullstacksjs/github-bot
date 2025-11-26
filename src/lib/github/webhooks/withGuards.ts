import type { EmitterWebhookEvent, EmitterWebhookEventName, HandlerFunction } from "@octokit/webhooks/types";

import { isRepositoryAccepted, isUserMuted } from "./handlers/_utils.ts";

/**
 * Wraps a GitHub webhook handler with common guards.
 *
 * This ensures that only events which meet certain conditions reach the handler:
 * - The event comes from an accepted repository (`isRepositoryAccepted` returns true).
 * - The user who triggered the event is not muted (`isUserMuted` returns false).

 * @template TEvent - The GitHub webhook event name (e.g., "pull_request.opened").
 * @param handler - The original handler function to wrap.
 * @returns A new handler function that applies the guards before calling the original handler.
 *
 * @example
 * webhooks.on("pull_request.opened", withGuards(pullRequestOpenedCallback));
 */

export function withGuards<TEvent extends EmitterWebhookEventName>(handler: HandlerFunction<TEvent, unknown>) {
  return async (event: EmitterWebhookEvent<TEvent>) => {
    if (!("repository" in event.payload)) return;

    const username = event.payload.sender?.login;
    const repo = event.payload.repository?.full_name;

    if (repo && !(await isRepositoryAccepted(repo))) return;

    if (username && (await isUserMuted(username))) return;

    return handler(event);
  };
}
