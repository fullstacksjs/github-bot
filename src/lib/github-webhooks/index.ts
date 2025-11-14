import { Webhooks } from "@octokit/webhooks";

import { config } from "@/config";

import { issuesOpenedCallback } from "./handlers/issues-opened";
import { pullRequestClosedCallback } from "./handlers/pull-request-closed";
import { pullRequestOpenedCallback } from "./handlers/pull-request-opened";
import { releaseCreatedCallback } from "./handlers/release-created";
import { repositoryCreatedCallback } from "./handlers/repository-created";
import { starCreatedCallback } from "./handlers/star-created";

export const webhooks = new Webhooks({ secret: config.github.webhookSecret });

webhooks.on("issues.opened", issuesOpenedCallback);
webhooks.on("pull_request.closed", pullRequestClosedCallback);
webhooks.on("pull_request.opened", pullRequestOpenedCallback);
webhooks.on("release.created", releaseCreatedCallback);
webhooks.on("repository.created", repositoryCreatedCallback);
webhooks.on("star.created", starCreatedCallback);
