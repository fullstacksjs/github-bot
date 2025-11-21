import { Command } from "@grammyjs/commands";
import { eq } from "drizzle-orm";

import { config } from "@/config";
import { db, schema } from "@/db";

import type { BotContext } from "../context";

import { escapeMarkdown } from "../../lib/escape-markdown";

export async function whoamiHandler(ctx: BotContext) {
  if (!ctx.message) return;

  const sender = ctx.message.from;
  const tgUsername = sender.username;
  if (!tgUsername) {
    return await ctx.replyToMessage(ctx.t("cmd_whoami_no_username"));
  }

  const ghUser = await db.query.contributors.findFirst({
    columns: { ghUsername: true },
    where: (f, o) => o.eq(f.tgUsername, tgUsername),
  });

  if (!ghUser) {
    return await ctx.replyToMessage(ctx.t("cmd_whoami_not_found"));
  }

  const fullName = `${sender.first_name} ${sender.last_name ?? ""}`;
  const githubUrl = `https://github.com/${ghUser.ghUsername}`;

  // Make user's Telegram information fresh.
  await db
    .update(schema.contributors)
    .set({ tgName: fullName, tgId: sender.id })
    .where(eq(schema.contributors.tgUsername, tgUsername));

  return await ctx.md.replyToMessage(
    ctx.t("cmd_whoami", {
      name: escapeMarkdown(fullName),
      githubUrl: escapeMarkdown(githubUrl),
      ghUsername: escapeMarkdown(ghUser.ghUsername),
    }),
    { link_preview_options: { prefer_small_media: true, is_disabled: false, url: githubUrl } },
  );
}

export const cmdWhoami = new Command<BotContext>("whoami", "Who am I?")
  .addToScope({ type: "chat", chat_id: config.bot.chatId }, whoamiHandler)
  .addToScope({ type: "chat_administrators", chat_id: config.bot.chatId }, whoamiHandler);
