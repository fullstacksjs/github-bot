import { Command } from "@grammyjs/commands";
import { config } from "#config";
import { db, schema } from "#db";
import { isGitHubUrl } from "#github";
import { eq } from "drizzle-orm";

import type { BotContext } from "../bot.ts";

import { escapeMarkdown } from "../../lib/escape-markdown.ts";

export async function removerepoHandler(ctx: BotContext) {
  if (!ctx.message) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const parts = ctx.message.text?.split(" ") ?? [];
  const gitHubUrl = parts[1];

  if (parts.length < 2 || !isGitHubUrl(gitHubUrl)) {
    return await ctx.md.replyToMessage(ctx.t("cmd_removerepo_help"));
  }

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
