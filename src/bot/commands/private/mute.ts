import { Command } from "@grammyjs/commands";
import { eq } from "drizzle-orm";

import { config } from "@/config";
import { db, schema } from "@/db";

import type { BotContext } from "../../bot.ts";

import { escapeMarkdown } from "../../../lib/escape-markdown.ts";

export async function muteHandler(ctx: BotContext) {
  if (!ctx.message) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const parts = ctx.message.text?.split(" ") ?? [];
  const githubUsername = parts[1];

  if (parts.length < 2 || !githubUsername) {
    return await ctx.md.replyToMessage(ctx.t("cmd_mute_help"));
  }

  const existingContributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.ghUsername, githubUsername),
  });

  if (existingContributor?.isMuted) {
    return await ctx.md.replyToMessage(ctx.t("cmd_mute_already", { ghUsername: escapeMarkdown(githubUsername) }));
  }

  if (existingContributor) {
    await db
      .update(schema.contributors)
      .set({ isMuted: true })
      .where(eq(schema.contributors.ghUsername, githubUsername));
  } else {
    await db.insert(schema.contributors).values({
      ghUsername: githubUsername,
      isMuted: true,
    });
  }

  return await ctx.md.replyToMessage(ctx.t("cmd_mute"));
}

export const cmdMute = new Command<BotContext>("mute", "🔇 Mute GitHub accounts").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  muteHandler,
);
