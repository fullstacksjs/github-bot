import { serve } from "@hono/node-server";
import { bot } from "#bot";
import { config } from "#config";
import { webhooks } from "#webhooks";
import { webhookCallback } from "grammy";
import { Hono } from "hono";
import * as z from "zod";

async function startApi() {
  const api = new Hono();

  if (!config.bot.polling)
    api.use(`/api/webhook/telegram`, webhookCallback(bot, "hono", { secretToken: config.bot.webhookSecret }));

  api.post(`/api/webhook/github`, async (ctx) => {
    const payload = z
      .object({
        id: z.string(),
        name: z.string(),
        signature: z.string(),
        payload: z.string(),
      })
      .safeParse({
        id: ctx.req.header("X-GitHub-Delivery") ?? "",
        name: ctx.req.header("X-GitHub-Event") ?? "",
        signature: ctx.req.header("X-Hub-Signature-256") ?? "",
        payload: await ctx.req.text(),
      });

    if (!payload.success) {
      // eslint-disable-next-line no-console
      console.error("Invalid payload:", payload.error);
      return ctx.text("Bad Request", 400);
    }

    await webhooks.verifyAndReceive(payload.data);

    return ctx.text("Accepted", 202);
  });

  return serve({ fetch: api.fetch, port: config.api.port });
}

await bot.setCommands();

if (config.bot.polling) bot.start();
else await bot.setupWebhook();

await startApi();
