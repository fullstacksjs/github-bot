import { config } from "#config";
import { db, schema } from "#db";
import { createCommand } from "#telegram";
import { desc, eq, sum } from "drizzle-orm";

import type { BotContext } from "../bot.ts";

import { escapeMarkdown } from "../../lib/escape-markdown.ts";

export async function listcontributorsHandler(ctx: BotContext) {
  const contributors = await db
    .select({
      contributions: sum(schema.repositoryContributors.contributions),
      tgId: schema.contributors.tgId,
      tgUsername: schema.contributors.tgUsername,
      tgName: schema.contributors.tgName,
      ghUsername: schema.contributors.ghUsername,
    })
    .from(schema.repositoryContributors)
    .leftJoin(schema.contributors, eq(schema.repositoryContributors.contributorId, schema.contributors.id))
    .groupBy(schema.contributors.ghUsername)
    .orderBy(desc(sum(schema.repositoryContributors.contributions)));

  if (contributors.length === 0) {
    return await ctx.md.replyToMessage(ctx.t("cmd_listcontributors_empty"));
  }

  const contributorEntries = contributors.map((c) => {
    let tgLink: string;
    if (c.tgId) {
      const displayName = c.tgName || c.tgUsername || c.tgId.toString();
      tgLink = `[${escapeMarkdown(displayName)}](tg://user?id=${c.tgId})`;
    } else if (c.tgUsername) {
      tgLink = `@${escapeMarkdown(c.tgUsername)}`;
    } else {
      tgLink = "🤷‍♂️";
    }

    return ctx.t("cmd_listcontributors_url", {
      contributions: c.contributions ?? 0,
      ghUsername: c.ghUsername ? escapeMarkdown(c.ghUsername) : "",
      ghUrl: c.ghUsername ? escapeMarkdown(`https://github.com/${c.ghUsername}`) : "",
      tgUsername: tgLink,
    });
  });

  return await ctx.md.replyToMessage(
    ctx.t("cmd_listcontributors", {
      contributors: contributorEntries.join("\n"),
      count: contributorEntries.length,
    }),
  );
}

export const cmdListContributors = createCommand({
  template: "listcontributors",
  description: "List monitored contributors",
  handler: listcontributorsHandler,
  scopes: [
    { type: "chat", chat_id: config.bot.chatId },
    { type: "chat_administrators", chat_id: config.bot.chatId },
  ],
});
