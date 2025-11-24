import { Command } from "@grammyjs/commands";
import { config } from "#config";
import { db, schema } from "#db";
import { eq } from "drizzle-orm";

import type { BotContext } from "../bot.ts";

import { escapeMarkdown } from "../../lib/escape-markdown.ts";

export async function whoamiHandler(ctx: BotContext) {
  if (!ctx.message) return;

  const sender = ctx.message.from;

  const ghUser = await db.query.contributors.findFirst({
    columns: { ghUsername: true },
    where: (f, o) => o.or(o.eq(f.tgId, sender.id), o.eq(f.tgUsername, sender.username ?? "")),
  });

  if (!ghUser) {
    return await ctx.replyToMessage(ctx.t("cmd_whoami_not_found"));
  }

  const fullName = `${sender.first_name} ${sender.last_name ?? ""}`;
  const githubUrl = `https://github.com/${ghUser.ghUsername}`;

  // Make user's Telegram information fresh.
  await db
    .update(schema.contributors)
    .set({ tgName: fullName, tgId: sender.id, tgUsername: sender.username })
    .where(eq(schema.contributors.ghUsername, ghUser.ghUsername));

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
