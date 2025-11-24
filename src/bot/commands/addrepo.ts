import { config } from "#config";
import { db, schema as s } from "#db";
import { extractRepoName } from "#github";
import { createCommand, zs } from "#telegram";
import z from "zod";

import type { BotContext } from "../bot.ts";

const schema = z.object({
  repoUrl: zs.repoUrl,
});

// TODO: Fetch and store contributors too
export async function handler(ctx: BotContext<z.infer<typeof schema>>) {
  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const { repoUrl } = ctx.args;
  const repoName = extractRepoName(repoUrl);
  if (!repoName) {
    return await ctx.md.replyToMessage(ctx.t("cmd_addrepo_help"));
  }

  await db
    .insert(s.repositories)
    .values({
      name: repoName,
      htmlUrl: repoUrl,
    })
    .onConflictDoUpdate({
      target: s.repositories.name,
      set: { isBlacklisted: false },
    });

  return await ctx.md.replyToMessage(ctx.t("cmd_addrepo"));
}

export const cmdAddRepo = createCommand({
  template: "addrepo $repoUrl",
  description: "🛡 Add a repository",
  handler,
  schema,
  helpMessage: (t) => t("cmd_addrepo_help"),
  scopes: [{ type: "chat_administrators", chat_id: config.bot.chatId }],
});
