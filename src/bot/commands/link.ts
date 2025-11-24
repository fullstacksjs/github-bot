import { Command } from "@grammyjs/commands";
import { config } from "#config";
import { db, schema } from "#db";
import { cleanTelegramUsername } from "#telegram";
import { eq } from "drizzle-orm";

import type { BotContext } from "../bot.ts";

export async function linkHandler(ctx: BotContext) {
  if (!ctx.message) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const parts = ctx.message.text?.split(" ") ?? [];
  const repliedMessage = ctx.message.reply_to_message;
  const isActualReply = repliedMessage && !repliedMessage.forum_topic_created;

  const ghUsername = parts[1];
  let tgId: number | undefined;
  let tgUsername: string | undefined;

  if (isActualReply) {
    if (!ghUsername) {
      return await ctx.md.replyToMessage(ctx.t("cmd_link_help"));
    }

    const targetUser = repliedMessage.from;

    if (!targetUser) {
      return await ctx.md.replyToMessage(ctx.t("cmd_link_no_user"));
    }

    tgId = targetUser.id;
    tgUsername = targetUser.username;
  } else {
    const telegramUsername = parts[2];

    if (parts.length < 3 || !ghUsername || !telegramUsername) {
      return await ctx.md.replyToMessage(ctx.t("cmd_link_help"));
    }

    tgUsername = cleanTelegramUsername(telegramUsername);
  }

  const existingContributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.ghUsername, ghUsername),
  });

  if (existingContributor) {
    await db
      .update(schema.contributors)
      .set({ tgId, tgUsername })
      .where(eq(schema.contributors.ghUsername, ghUsername));
  } else {
    await db.insert(schema.contributors).values({
      ghUsername,
      tgId,
      tgUsername,
    });
  }

  return await ctx.md.replyToMessage(ctx.t("cmd_link"));
}

export const cmdLink = new Command<BotContext>("link", "🛡 Link Telegram and GitHub accounts").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  linkHandler,
);
