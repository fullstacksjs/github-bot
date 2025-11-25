import type { BotContext } from "#bot";

import { config } from "#config";
import { db, schema as s } from "#db";
import { createCommand, zs } from "#telegram";
import { eq } from "drizzle-orm";
import z from "zod";

import { escapeMarkdown } from "../../../lib/escape-markdown.ts";

const schema = z.object({ gitHubUrl: zs.repoUrl });

export async function handler(ctx: BotContext<z.infer<typeof schema>>) {
  const { gitHubUrl } = ctx.args;

  const repo = await db.query.repositories.findFirst({
    where: (f, o) => o.eq(f.htmlUrl, gitHubUrl),
  });

  if (!repo) {
    return await ctx.md.replyToMessage(ctx.t("cmd_removerepo_not_found"));
  }

  await db.update(s.repositories).set({ isBlacklisted: true }).where(eq(s.repositories.id, repo.id));

  return await ctx.md.replyToMessage(
    ctx.t("cmd_removerepo", { name: escapeMarkdown(repo.name), url: escapeMarkdown(repo.htmlUrl) }),
  );
}

export const cmdRemoveRepo = createCommand({
  template: "removerepo $gitHubUrl",
  description: "🛡 Remove a repository",
  handler,
  schema,
  helpMessage: (t) => t("cmd_removerepo_help"),
  scopes: [{ type: "chat_administrators", chat_id: config.bot.chatId }],
});
