import { Command } from "@grammyjs/commands";
import { config } from "#config";

import type { BotContext } from "../bot.ts";

import { startDiscovery } from "../../lib/discovery.ts";
import { escapeMarkdown } from "../../lib/escape-markdown.ts";

export async function discoverHandler(ctx: BotContext) {
  if (!ctx.message) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.replyToMessage(ctx.t("insufficient_permissions"));
  }
  const update = await ctx.md.replyToMessage(ctx.t("cmd_discover"));

  startDiscovery().then((rawDuration) => {
    const duration = (rawDuration / 1000).toFixed(2);

    return ctx.api.editMessageText(
      update.chat.id,
      update.message_id,
      ctx.t("cmd_discover_done", { duration: escapeMarkdown(duration) }),
      { parse_mode: "MarkdownV2" },
    );
  });
}

export const cmdDiscover = new Command<BotContext>("discover", "🛡 Update the repository database").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  discoverHandler,
);
