import { Command } from "@grammyjs/commands";

import { config } from "@/config";

import type { BotContext } from "../bot";

import { startDiscovery } from "../../lib/discovery";
import { escapeMarkdown } from "../../lib/escape-markdown";

export async function discoverHandler(ctx: BotContext) {
  if (!ctx.message) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.reply(ctx.t("insufficient_permissions"), {
      parse_mode: "MarkdownV2",
      reply_parameters: { message_id: ctx.message.message_id },
    });
  }

  const update = await ctx.reply(ctx.t("cmd_discover"), {
    parse_mode: "MarkdownV2",
    reply_parameters: { message_id: ctx.message.message_id },
  });

  const rawDuration = await startDiscovery();

  const duration = (rawDuration / 1000).toFixed(2);

  ctx.api.editMessageText(
    update.chat.id,
    update.message_id,
    ctx.t("cmd_discover_done", { duration: escapeMarkdown(duration) }),
    { parse_mode: "MarkdownV2" },
  );
}

export const cmdDiscover = new Command<BotContext>("discover", "🛡 Update the repository database").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  discoverHandler,
);
