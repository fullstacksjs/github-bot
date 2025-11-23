import { Command } from "@grammyjs/commands";
import { config } from "#config";
import { db, schema } from "#db";
import { CommandParser, zs } from "#telegram";
import { eq } from "drizzle-orm";
import z from "zod";

import type { BotContext } from "../bot.ts";

import { escapeMarkdown } from "../../lib/escape-markdown.ts";

export async function removerepoHandler(ctx: BotContext) {
  if (!ctx.message?.text) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const parser = CommandParser("/removerepo $gitHubUrl", z.object({ gitHubUrl: zs.repoUrl }));
  const { success, data } = parser(ctx.message.text);

  if (!success) {
    return await ctx.md.replyToMessage(ctx.t("cmd_removerepo_help"));
  }

  const { gitHubUrl } = data;

  const repo = await db.query.repositories.findFirst({
    where: (f, o) => o.eq(f.htmlUrl, gitHubUrl),
  });

  if (!repo) {
    return await ctx.md.replyToMessage(ctx.t("cmd_removerepo_not_found"));
  }

  await db.update(schema.repositories).set({ isBlacklisted: true }).where(eq(schema.repositories.id, repo.id));

  return await ctx.md.replyToMessage(
    ctx.t("cmd_removerepo", { name: escapeMarkdown(repo.name), url: escapeMarkdown(repo.htmlUrl) }),
  );
}

export const cmdRemoveRepo = new Command<BotContext>("removerepo", "🛡 Remove a repository").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  removerepoHandler,
);
