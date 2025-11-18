import { Command } from "@grammyjs/commands";
import { eq } from "drizzle-orm";

import { config } from "@/config";
import { db, schema } from "@/db";

import type { BotContext } from "../bot";

import { escapeMarkdown } from "../../lib/escape-markdown";

export async function whoamiHandler(ctx: BotContext) {
  if (!ctx.message) return; // the update must be a new message.

  const sender = ctx.message.from;

  const ghUser = await db.query.contributors.findFirst({
    columns: { ghUsername: true },
    where: (f, o) => o.eq(f.tgId, sender.id),
  });

  if (!ghUser) {
    return await ctx.reply(ctx.t("cmd_whoami_not_found"));
  }

  const name = sender.first_name + (sender.last_name ? ` ${sender.last_name}` : "");
  const username = sender.username;
  const githubUrl = `https://github.com/${ghUser.ghUsername}`;

  // Make user's Telegram information fresh.
  await db
    .update(schema.contributors)
    .set({ tgName: name, tgUsername: username })
    .where(eq(schema.contributors.tgId, sender.id));

  return await ctx.reply(
    ctx.t("cmd_whoami", {
      name: escapeMarkdown(name),
      githubUrl: escapeMarkdown(githubUrl),
    }),
    {
      parse_mode: "MarkdownV2",
      reply_parameters: { message_id: ctx.message.message_id },
      link_preview_options: { prefer_small_media: true },
    },
  );
}

export const cmdWhoami = new Command<BotContext>("whoami", "Who am I?")
  .addToScope({ type: "chat", chat_id: config.bot.chatId }, whoamiHandler)
  .addToScope({ type: "chat_administrators", chat_id: config.bot.chatId }, whoamiHandler);
