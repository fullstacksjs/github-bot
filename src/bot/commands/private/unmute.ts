import type { BotContext } from "#bot";

import { config } from "#config";
import { db, schema as s } from "#db";
import { createCommand, zs } from "#telegram";
import { eq } from "drizzle-orm";
import z from "zod";

import { escapeMarkdown } from "../../../lib/escape-markdown.ts";

const schema = z.object({
  ghUsername: zs.ghUsername,
});

export async function handler(ctx: BotContext<z.infer<typeof schema>>) {
  const { ghUsername } = ctx.args;

  const existingContributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.ghUsername, ghUsername),
  });

  if (!existingContributor) {
    return await ctx.replyToMessage(ctx.t("cmd_no_contributor"));
  }

  if (!existingContributor?.isMuted) {
    return await ctx.md.replyToMessage(ctx.t("cmd_unmute_already", { ghUsername: escapeMarkdown(ghUsername) }));
  }

  await db.update(s.contributors).set({ isMuted: false }).where(eq(s.contributors.ghUsername, ghUsername));

  return await ctx.md.replyToMessage(ctx.t("cmd_unmute"));
}

export const cmdUnmute = createCommand({
  template: "unmute $ghUsername",
  description: "🔊 Unmute GitHub accounts",
  handler,
  schema,
  helpMessage: (t) => t("cmd_unmute_help"),
  scopes: [{ type: "chat_administrators", chat_id: config.bot.chatId }],
});
