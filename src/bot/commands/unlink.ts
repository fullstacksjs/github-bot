import { Command } from "@grammyjs/commands";
import { config } from "#config";
import { db, schema } from "#db";
import { CommandParser, zs } from "#telegram";
import { eq } from "drizzle-orm";
import z from "zod";

import type { BotContext } from "../bot.ts";

export async function unlinkHandler(ctx: BotContext) {
  if (!ctx.message?.text) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const parser = CommandParser("/unlink $tgUsername", z.object({ tgUsername: zs.tgUsername }));
  const { success, data } = parser(ctx.message.text);

  if (!success) {
    return await ctx.md.replyToMessage(ctx.t("cmd_unlink_help"));
  }
  const { tgUsername } = data;

  const existingContributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.tgUsername, tgUsername),
  });

  if (!existingContributor) {
    return await ctx.md.replyToMessage(ctx.t("cmd_unlink_not_found"));
  }

  await db.update(schema.contributors).set({ tgUsername: null }).where(eq(schema.contributors.tgUsername, tgUsername));

  return await ctx.md.replyToMessage(ctx.t("cmd_unlink"));
}

export const cmdUnLink = new Command<BotContext>("unlink", "🛡 UnLink Telegram and GitHub accounts").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  unlinkHandler,
);
