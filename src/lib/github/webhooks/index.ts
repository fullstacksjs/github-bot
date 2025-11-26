import { Webhooks } from "@octokit/webhooks";
import { config } from "#config";

import { issuesOpenedCallback } from "./handlers/issues-opened.ts";
import { pullRequestClosedCallback } from "./handlers/pull-request-closed.ts";
import { pullRequestOpenedCallback } from "./handlers/pull-request-opened.ts";
import { releaseCreatedCallback } from "./handlers/release-created.ts";
import { repositoryCreatedCallback } from "./handlers/repository-created.ts";
import { starCreatedCallback } from "./handlers/star-created.ts";
import { withGuards } from "./withGuards.ts";

export const webhooks = new Webhooks({ secret: config.github.webhookSecret });

webhooks.on("issues.opened", withGuards(issuesOpenedCallback));
webhooks.on("pull_request.closed", withGuards(pullRequestClosedCallback));
webhooks.on("pull_request.opened", withGuards(pullRequestOpenedCallback));
webhooks.on("release.created", withGuards(releaseCreatedCallback));
webhooks.on("repository.created", withGuards(repositoryCreatedCallback));
webhooks.on("star.created", withGuards(starCreatedCallback));
