import { Command } from "@grammyjs/commands";

import { config } from "@/config";

import type { BotContext } from "../bot";

export async function helpHandler(ctx: BotContext) {
  if (!ctx.message) return;

  const isAdmin = config.bot.adminIds.includes(ctx.message.from.id);

  return await ctx.replyToMessage(ctx.t(isAdmin ? "cmd_help_admin" : "cmd_help"));
}

export const cmdHelp = new Command<BotContext>("help", "About This Bot").addToScope(
  { type: "chat", chat_id: config.bot.chatId },
  helpHandler,
);
