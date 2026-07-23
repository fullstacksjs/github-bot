import { bot } from "#bot";
import { config } from "#config";
import { webhooks } from "#webhooks";
import { webhookCallback } from "grammy";
import { Hono } from "hono";
import * as z from "zod";

import { reportWebhookError } from "./lib/github/webhooks/report.ts";

export async function createApi() {
  const api = new Hono();

  if (!config.bot.polling)
    api.use(`/api/webhook/telegram`, webhookCallback(bot, "hono", { secretToken: config.bot.webhookSecret }));

  api.post(`/api/webhook/github`, async (ctx) => {
    const deliveryId = ctx.req.header("X-GitHub-Delivery");
    const eventName = ctx.req.header("X-GitHub-Event");
    const signature = ctx.req.header("X-Hub-Signature-256");
    const payload = z
      .object({
        id: z.string(),
        name: z.string(),
        signature: z.string(),
        payload: z.string(),
      })
      .safeParse({
        id: deliveryId,
        name: eventName,
        signature,
        payload: await ctx.req.text(),
      });

    if (!payload.success) {
      // eslint-disable-next-line no-console
      console.error("Invalid payload:", payload.error);
      await reportWebhookError(payload.error, {
        eventId: deliveryId,
        eventName,
        source: "request_validation",
      });
      return ctx.text("Bad Request", 400);
    }

    try {
      await webhooks.verifyAndReceive(payload.data);
    } catch (error) {
      await reportWebhookError(error, {
        eventId: payload.data.id,
        eventName: payload.data.name,
        source: "request_processing",
      });
      throw error;
    }

    return ctx.text("Accepted", 202);
  });

  return api;
}
