import { Webhooks } from "@octokit/webhooks";

import { config } from "@/config";

export const webhooks = new Webhooks({ secret: config.github.webhookSecret });

webhooks.on("issues.opened", async (event) => {
  console.log(event);
});

webhooks.on("pull_request.closed", async (event) => {
  const isMerged = event.payload.pull_request.merged;
  if (!isMerged) return;

  console.log(event);
});

webhooks.on("pull_request.opened", async (event) => {
  console.log(event);
});

webhooks.on("release.created", async (event) => {
  console.log(event);
});

webhooks.on("repository.created", async (event) => {
  console.log(event);
});

webhooks.on("star.created", async (event) => {
  console.log(event);
});
