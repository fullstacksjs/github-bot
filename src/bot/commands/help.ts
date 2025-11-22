import { Command } from "@grammyjs/commands";

import { config } from "@/config";

import type { BotContext } from "../bot";

export async function helpHandler(ctx: BotContext) {
  if (!ctx.message) return;

  return await ctx.replyToMessage(ctx.t("cmd_help_commands"));
}

export const cmdHelp = new Command<BotContext>("help", "About This Bot").addToScope(
  { type: "chat", chat_id: config.bot.chatId },
  helpHandler,
);
