import type { SQLiteInsertValue, SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core";

import { Command } from "@grammyjs/commands";
import { config } from "#config";
import { db, schema } from "#db";
import { CommandParser, zs } from "#telegram";
import z from "zod";

import type { BotContext } from "../bot.ts";

export async function linkHandler(ctx: BotContext) {
  if (!ctx.message?.text) return;
  const repliedMessage = ctx.message.reply_to_message;
  const isActualReply = repliedMessage && !repliedMessage.forum_topic_created;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const { success, data } = CommandParser(
    "/link $ghUsername $tgUsername",
    z.object({
      ghUsername: zs.ghUsername,
      tgUsername: zs.tgUsername.optional(),
    }),
  )(ctx.message.text);

  if (!success) {
    return await ctx.md.replyToMessage(ctx.t("cmd_link_help"));
  }

  const { ghUsername, tgUsername } = data;
  const tgId = isActualReply ? repliedMessage.from?.id : null;

  if (!tgId && !tgUsername) {
    return await ctx.md.replyToMessage(ctx.t("cmd_link_no_user"));
  }

  const set: SQLiteInsertValue<typeof schema.contributors> = { ghUsername };
  if (tgId) set.tgId = tgId;
  if (tgUsername) set.tgUsername = tgUsername;

  await db
    .insert(schema.contributors)
    .values(set)
    .onConflictDoUpdate({
      target: schema.contributors.ghUsername,
      set: set as SQLiteUpdateSetSource<typeof schema.contributors>,
    });

  return await ctx.md.replyToMessage(ctx.t("cmd_link"));
}

export const cmdLink = new Command<BotContext>("link", "🛡 Link Telegram and GitHub accounts").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  linkHandler,
);
