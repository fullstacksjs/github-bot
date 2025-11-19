import { Command } from "@grammyjs/commands";

import { config } from "@/config";
import { db } from "@/db";

import type { BotContext } from "../context";

import { escapeMarkdown } from "../../lib/escape-markdown";

export async function listreposHandler(ctx: BotContext) {
  if (!ctx.message) return;

  const repos = await db.query.repositories.findMany({
    columns: { name: true, htmlUrl: true },
    where: (f, o) => o.eq(f.isBlacklisted, false),
    orderBy: (f, o) => o.asc(f.name),
  });

  if (repos.length === 0) {
    return await ctx.md.replyToMessage(ctx.t("cmd_listrepos_no_repo"));
  }

  const repositories = repos.map((repo) =>
    ctx.t("cmd_listrepos_url", { name: escapeMarkdown(repo.name), url: escapeMarkdown(repo.htmlUrl) }),
  );

  return await ctx.md.replyToMessage(
    ctx.t("cmd_listrepos", {
      repositories: repositories.join("\n"),
      repositoriesCount: repositories.length,
    }),
  );
}

export const cmdListRepos = new Command<BotContext>("listrepos", "List monitored repositories")
  .addToScope({ type: "chat", chat_id: config.bot.chatId }, listreposHandler)
  .addToScope({ type: "chat_administrators", chat_id: config.bot.chatId }, listreposHandler);
