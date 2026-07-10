import type { SQLiteInsertValue, SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core";

import { config } from "#config";
import { db, schema as s } from "#db";
import { createCommand, zs } from "#telegram";
import z from "zod";

import type { BotContext } from "../../bot.ts";

const schema = z.object({
  ghUsername: zs.ghUsername,
  tgUsername: zs.tgUsername.optional(),
});

export async function handler(ctx: BotContext<z.infer<typeof schema>>) {
  const repliedMessage = ctx.message.reply_to_message;
  const isActualReply = repliedMessage && !repliedMessage.forum_topic_created;

  const { ghUsername } = ctx.args;
  let { tgUsername } = ctx.args;

  const from = isActualReply ? repliedMessage.from : undefined;
  const tgId = from?.id ?? null;
  const tgName = from ? [from.first_name, from.last_name].filter(Boolean).join(" ") : null;

  if (from?.username) {
    const result = zs.tgUsername.safeParse(from.username);
    if (result.success) {
      tgUsername = result.data;
    }
  }

  if (!tgId && !tgUsername) {
    return await ctx.html.replyToMessage(ctx.t("cmd_link_no_user"));
  }

  const set: SQLiteInsertValue<typeof s.contributors> = { ghUsername };
  if (tgId) set.tgId = tgId;
  if (tgName) set.tgName = tgName;
  if (tgUsername) set.tgUsername = tgUsername;

  await db
    .insert(s.contributors)
    .values(set)
    .onConflictDoUpdate({
      target: s.contributors.ghUsername,
      set: set as SQLiteUpdateSetSource<typeof s.contributors>,
    });

  return await ctx.html.replyToMessage(ctx.t("cmd_link"));
}

export const cmdLink = createCommand({
  template: "link $ghUsername $tgUsername",
  description: "🛡 Link Telegram and GitHub accounts",
  handler,
  schema,
  helpMessage: (t) => t("cmd_link_help"),
  scopes: [{ type: "chat_administrators", chat_id: config.bot.chatId }],
});
