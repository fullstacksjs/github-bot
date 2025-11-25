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
  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const { ghUsername } = ctx.args;

  if (!ghUsername) {
    return await ctx.md.replyToMessage(ctx.t("cmd_mute_help"));
  }

  const existingContributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.ghUsername, ghUsername),
  });

  if (existingContributor?.isMuted) {
    return await ctx.md.replyToMessage(ctx.t("cmd_mute_already", { ghUsername: escapeMarkdown(ghUsername) }));
  }

  if (existingContributor) {
    await db.update(s.contributors).set({ isMuted: true }).where(eq(s.contributors.ghUsername, ghUsername));
  } else {
    await db.insert(s.contributors).values({
      ghUsername,
      isMuted: true,
    });
  }

  return await ctx.md.replyToMessage(ctx.t("cmd_mute"));
}

export const cmdMute = createCommand({
  template: "mute $ghUsername",
  description: "🔇 Mute GitHub accounts",
  handler,
  schema,
  helpMessage: (t) => t("cmd_mute_help"),
  scopes: [{ type: "chat_administrators", chat_id: config.bot.chatId }],
});
