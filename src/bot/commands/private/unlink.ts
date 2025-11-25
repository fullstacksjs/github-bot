import { config } from "#config";
import { db, schema as s } from "#db";
import { createCommand, zs } from "#telegram";
import { eq } from "drizzle-orm";
import z from "zod";

import type { BotContext } from "../../bot.ts";

const schema = z.object({ tgUsername: zs.tgUsername });

export async function handler(ctx: BotContext) {
  const { tgUsername } = ctx.args;

  const existingContributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.tgUsername, tgUsername),
  });

  if (!existingContributor) {
    return await ctx.md.replyToMessage(ctx.t("cmd_unlink_not_found"));
  }

  await db.update(s.contributors).set({ tgUsername: null }).where(eq(s.contributors.tgUsername, tgUsername));

  return await ctx.md.replyToMessage(ctx.t("cmd_unlink"));
}

export const cmdUnlink = createCommand({
  template: "unlink $tgUsername",
  description: "🛡 UnLink Telegram and GitHub accounts",
  handler,
  schema,
  helpMessage: (t) => t("cmd_unlink_help"),
  scopes: [{ type: "chat_administrators", chat_id: config.bot.chatId }],
});
