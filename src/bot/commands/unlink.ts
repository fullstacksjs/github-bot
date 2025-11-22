import { Command } from "@grammyjs/commands";
import { eq } from "drizzle-orm";

import { config } from "@/config";
import { db, schema } from "@/db";

import type { BotContext } from "../bot";

import { cleanTelegramUsername } from "../../lib/telegram";

export async function unlinkHandler(ctx: BotContext) {
  if (!ctx.message) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const telegramUsername = ctx.message.text;

  if (!telegramUsername) {
    return await ctx.md.replyToMessage(ctx.t("cmd_unlink_help"));
  }

  const cleanTgUsername = cleanTelegramUsername(telegramUsername);

  const existingContributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.tgUsername, cleanTgUsername),
  });

  if (!existingContributor) {
    return await ctx.md.replyToMessage(ctx.t("cmd_unlink_not_found"));
  }

  await db
    .update(schema.contributors)
    .set({ tgUsername: null })
    .where(eq(schema.contributors.tgUsername, cleanTgUsername));

  return await ctx.md.replyToMessage(ctx.t("cmd_unlink"));
}

export const cmdUnLink = new Command<BotContext>("unlink", "🛡 UnLink Telegram and GitHub accounts").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  unlinkHandler,
);
