import { Command } from "@grammyjs/commands";
import { eq } from "drizzle-orm";

import type { BotContext } from "@/bot";

import { config } from "@/config";
import { db, schema } from "@/db";
import { isGitHubUrl } from "@/github";

import { escapeMarkdown } from "../lib/escape-markdown";

export async function removerepoHandler(ctx: BotContext) {
  if (!ctx.message) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.reply(ctx.t("insufficient_permissions"), {
      parse_mode: "MarkdownV2",
      reply_parameters: { message_id: ctx.message.message_id },
    });
  }

  const parts = ctx.message.text?.split(" ") ?? [];
  const gitHubUrl = parts[1];

  if (parts.length < 2 || !isGitHubUrl(gitHubUrl)) {
    return await ctx.reply(ctx.t("cmd_removerepo_help"), {
      parse_mode: "MarkdownV2",
      reply_parameters: { message_id: ctx.message.message_id },
    });
  }

  const repo = await db.query.repositories.findFirst({
    where: (f, o) => o.eq(f.htmlUrl, gitHubUrl),
  });

  if (!repo) {
    return await ctx.reply(ctx.t("cmd_removerepo_not_found"), {
      parse_mode: "MarkdownV2",
      reply_parameters: { message_id: ctx.message.message_id },
    });
  }

  await db.update(schema.repositories).set({ isBlacklisted: true }).where(eq(schema.repositories.id, repo.id));

  return await ctx.reply(
    ctx.t("cmd_removerepo", { name: escapeMarkdown(repo.name), url: escapeMarkdown(repo.htmlUrl) }),
    {
      parse_mode: "MarkdownV2",
      reply_parameters: { message_id: ctx.message.message_id },
      link_preview_options: { is_disabled: true },
    },
  );
}

export const cmdRemoveRepo = new Command<BotContext>("removerepo", "🛡 Remove a repository").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  removerepoHandler,
);
