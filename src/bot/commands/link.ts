import { Command } from "@grammyjs/commands";
import { config } from "#config";
import { db, schema } from "#db";
import { cleanTelegramUsername } from "#telegram";
import { eq } from "drizzle-orm";

import type { BotContext } from "../bot.ts";

interface TelegramAccountData {
  tgId?: number;
  tgUsername?: string;
}

async function linkAccounts(githubUsername: string, telegramData: TelegramAccountData) {
  const existingContributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.ghUsername, githubUsername),
  });

  if (existingContributor) {
    await db.update(schema.contributors).set(telegramData).where(eq(schema.contributors.ghUsername, githubUsername));
  } else {
    await db.insert(schema.contributors).values({
      ghUsername: githubUsername,
      ...telegramData,
    });
  }
}

export async function linkHandler(ctx: BotContext) {
  if (!ctx.message) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const parts = ctx.message.text?.split(" ") ?? [];
  const repliedMessage = ctx.message.reply_to_message;
  const isActualReply = repliedMessage && !repliedMessage.forum_topic_created;

  if (isActualReply) {
    const githubUsername = parts[1];

    if (!githubUsername) {
      return await ctx.md.replyToMessage(ctx.t("cmd_link_help"));
    }

    const targetUser = repliedMessage.from;

    if (!targetUser) {
      return await ctx.md.replyToMessage(ctx.t("cmd_link_no_user"));
    }

    await linkAccounts(githubUsername, {
      tgId: targetUser.id,
      tgUsername: targetUser.username,
    });

    return await ctx.md.replyToMessage(ctx.t("cmd_link"));
  }

  const githubUsername = parts[1];
  const telegramUsername = parts[2];

  if (parts.length < 3 || !githubUsername || !telegramUsername) {
    return await ctx.md.replyToMessage(ctx.t("cmd_link_help"));
  }

  const cleanTgUsername = cleanTelegramUsername(telegramUsername);

  await linkAccounts(githubUsername, {
    tgUsername: cleanTgUsername,
  });

  return await ctx.md.replyToMessage(ctx.t("cmd_link"));
}

export const cmdLink = new Command<BotContext>("link", "🛡 Link Telegram and GitHub accounts").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  linkHandler,
);
