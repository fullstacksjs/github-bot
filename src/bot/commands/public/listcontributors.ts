import { config } from "#config";
import { db, schema } from "#db";
import { createCommand } from "#telegram";
import { desc, eq, sum } from "drizzle-orm";

import type { BotContext } from "../../bot.ts";

import { escapeHtml } from "../../../lib/escape-html.ts";

export async function listcontributorsHandler(ctx: BotContext) {
  const contributors = await db
    .select({
      contributions: sum(schema.repositoryContributors.contributions),
      tgId: schema.contributors.tgId,
      tgUsername: schema.contributors.tgUsername,
      tgName: schema.contributors.tgName,
      ghUsername: schema.contributors.ghUsername,
      isMuted: schema.contributors.isMuted,
    })
    .from(schema.repositoryContributors)
    .leftJoin(schema.contributors, eq(schema.repositoryContributors.contributorId, schema.contributors.id))
    .groupBy(schema.contributors.ghUsername)
    .orderBy(desc(sum(schema.repositoryContributors.contributions)));

  if (contributors.length === 0) {
    return await ctx.html.replyToMessage(ctx.t("cmd_listcontributors_empty"));
  }

  const contributorEntries = contributors.map((c) => {
    let tgLink: string;
    if (c.tgId) {
      const displayName = c.tgName || c.tgUsername || c.tgId.toString();
      tgLink = `<a href="tg://user?id=${c.tgId}">${escapeHtml(displayName)}</a>`;
    } else if (c.tgUsername) {
      const encodedUsername = encodeURIComponent(c.tgUsername);
      tgLink = `<a href="https://t.me/${encodedUsername}">${escapeHtml(c.tgName ?? c.tgUsername)}</a>`;
    } else {
      tgLink = "🤷‍♂️";
    }

    return ctx.t("cmd_listcontributors_url", {
      contributions: c.contributions ?? 0,
      isMuted: c.isMuted ? "🔇" : "",
      ghUsername: c.ghUsername ? escapeHtml(c.ghUsername) : "",
      ghUrl: c.ghUsername ? escapeHtml(`https://github.com/${c.ghUsername}`) : "",
      tgUsername: tgLink,
    });
  });

  return await ctx.html.replyToMessage(
    ctx.t("cmd_listcontributors", {
      contributors: contributorEntries.join("\n"),
      count: contributorEntries.length,
    }),
    { disable_notification: true },
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
