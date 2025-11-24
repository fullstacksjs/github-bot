import { config } from "#config";
import { db } from "#db";
import { createCommand } from "#telegram";

import type { BotContext } from "../bot.ts";

import { escapeMarkdown } from "../../lib/escape-markdown.ts";

export async function handler(ctx: BotContext) {
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

export const cmdListRepos = createCommand({
  template: "listrepos",
  description: "List monitored repositories",
  handler,
  scopes: [
    { type: "chat", chat_id: config.bot.chatId },
    { type: "chat_administrators", chat_id: config.bot.chatId },
  ],
});
