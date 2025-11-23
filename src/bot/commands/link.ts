import { Command } from "@grammyjs/commands";
import { eq } from "drizzle-orm";

import { config } from "@/config";
import { db, schema } from "@/db";

import type { BotContext } from "../bot";

import { cleanTelegramUsername, isTelegramId } from "../../lib/telegram";

export async function linkHandler(ctx: BotContext) {
  if (!ctx.message) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const parts = ctx.message.text?.split(" ") ?? [];
  const telegramArg = parts[1];
  const githubUsername = parts[2];

  if (parts.length < 3 || !telegramArg || !githubUsername) {
    return await ctx.md.replyToMessage(ctx.t("cmd_link_help"));
  }

  const existingContributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.ghUsername, githubUsername),
  });

  if (isTelegramId(telegramArg)) {
    const telegramId = Number(telegramArg);

    if (existingContributor) {
      await db
        .update(schema.contributors)
        .set({ tgId: telegramId })
        .where(eq(schema.contributors.ghUsername, githubUsername));
    } else {
      await db.insert(schema.contributors).values({
        ghUsername: githubUsername,
        tgId: telegramId,
      });
    }
  } else {
    const cleanTgUsername = cleanTelegramUsername(telegramArg);

    if (existingContributor) {
      await db
        .update(schema.contributors)
        .set({ tgUsername: cleanTgUsername })
        .where(eq(schema.contributors.ghUsername, githubUsername));
    } else {
      await db.insert(schema.contributors).values({
        ghUsername: githubUsername,
        tgUsername: cleanTgUsername,
      });
    }
  }

  return await ctx.md.replyToMessage(ctx.t("cmd_link"));
}

export const cmdLink = new Command<BotContext>("link", "🛡 Link Telegram and GitHub accounts").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  linkHandler,
);
