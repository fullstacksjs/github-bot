import { serve } from "@hono/node-server";
import { webhookCallback } from "grammy";
import { Hono } from "hono";

import { bot } from "./bot/bot";
import { config } from "./config";
import { webhooks } from "./lib/github-webhooks";

async function startApi() {
  const api = new Hono();

  api.use(`/api/webhook/telegram`, webhookCallback(bot, "hono", { secretToken: config.bot.webhookSecret }));

  api.post(`/api/webhook/github`, async (ctx) => {
    await webhooks.verifyAndReceive({
      id: ctx.req.header("x-request-id") ?? "",
      name: ctx.req.header("x-github-event") ?? "",
      signature: ctx.req.header("x-hub-signature") ?? "",
      payload: await ctx.req.text(),
    });

    return ctx.text("Accepted", 202);
  });

  return serve({ fetch: api.fetch, port: config.api.port });
}

await bot.setCommands();
await bot.setupWebhook({ url: config.bot.webhookUrl, secret: config.bot.webhookSecret });
await startApi();
