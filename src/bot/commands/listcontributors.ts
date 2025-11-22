import { Command } from "@grammyjs/commands";
import { desc, eq, sum } from "drizzle-orm";

import { config } from "@/config";
import { db, schema } from "@/db";

import type { BotContext } from "../bot";

import { escapeMarkdown } from "../../lib/escape-markdown";

export async function listcontributorsHandler(ctx: BotContext) {
  if (!ctx.message) return;

  // SELECT SUM(contributions), ghUsername, tgUsername FROM repository_contributors as rc JOIN contributors ON rc.contributorId = contributors.id GROUP BY rc.contributorId ORDER BY SUM(contributions) DESC;
  const contributors = await db
    .select({
      contributions: sum(schema.repositoryContributors.contributions),
      tgUsername: schema.contributors.tgUsername,
      ghUsername: schema.contributors.ghUsername,
    })
    .from(schema.repositoryContributors)
    .leftJoin(schema.contributors, eq(schema.repositoryContributors.contributorId, schema.contributors.id))
    .groupBy(schema.repositoryContributors.contributorId)
    .orderBy(desc(sum(schema.repositoryContributors.contributions)));

  if (contributors.length === 0) {
    return await ctx.md.replyToMessage(ctx.t("cmd_listcontributors_empty"));
  }

  const contributorEntries = contributors.map((c) =>
    ctx.t("cmd_listcontributors_url", {
      contributions: c.contributions ?? 0,
      ghUsername: c.ghUsername ? escapeMarkdown(c.ghUsername) : "",
      ghUrl: c.ghUsername ? escapeMarkdown(`https://github.com/${c.ghUsername}`) : "",
      tgUsername: c.tgUsername ? `@${escapeMarkdown(c.tgUsername)}` : "🤷‍♂️",
    }),
  );

  return await ctx.md.replyToMessage(
    ctx.t("cmd_listcontributors", {
      contributors: contributorEntries.join("\n"),
      count: contributorEntries.length,
    }),
  );
}

export const cmdListContributors = new Command<BotContext>("listcontributors", "List monitored contributors")
  .addToScope({ type: "chat", chat_id: config.bot.chatId }, listcontributorsHandler)
  .addToScope({ type: "chat_administrators", chat_id: config.bot.chatId }, listcontributorsHandler);
