import { Command } from "@grammyjs/commands";

import { config } from "@/config";
import { db, schema } from "@/db";
import { gitHubRepoName, isGitHubUrl } from "@/github";

import type { BotContext } from "../bot";

// TODO: Fetch and store contributors too
export async function addrepoHandler(ctx: BotContext) {
  if (!ctx.message) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.reply(ctx.t("insufficient_permissions"), {
      parse_mode: "MarkdownV2",
      reply_parameters: { message_id: ctx.message.message_id },
    });
  }

  const parts = ctx.message.text?.split(" ") ?? [];
  const repoUrl = parts[1];
  const repoName = gitHubRepoName(repoUrl);

  if (parts.length < 2 || !isGitHubUrl(repoUrl) || !repoName) {
    return await ctx.reply(ctx.t("cmd_addrepo_help"), {
      parse_mode: "MarkdownV2",
      reply_parameters: { message_id: ctx.message.message_id },
    });
  }

  await db
    .insert(schema.repositories)
    .values({
      name: repoName,
      htmlUrl: repoUrl,
    })
    .onConflictDoUpdate({
      target: schema.repositories.name,
      set: { isBlacklisted: false },
    });

  return await ctx.reply(ctx.t("cmd_addrepo"), {
    parse_mode: "MarkdownV2",
    reply_parameters: { message_id: ctx.message.message_id },
  });
}

export const cmdAddRepo = new Command<BotContext>("addrepo", "🛡 Add a repository").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  addrepoHandler,
);
