import { Command } from "@grammyjs/commands";
import { config } from "#config";
import { db, schema } from "#db";
import { extractRepoName } from "#github";
import { CommandParser, zs } from "#telegram";
import z from "zod";

import type { BotContext } from "../bot.ts";

// TODO: Fetch and store contributors too
export async function addrepoHandler(ctx: BotContext) {
  if (!ctx.message?.text) return;

  if (!config.bot.adminIds.includes(ctx.message.from.id)) {
    return await ctx.md.replyToMessage(ctx.t("insufficient_permissions"));
  }

  const command = CommandParser("/addrepo $repoUrl", z.object({ repoUrl: zs.repoUrl }));

  const { success, data } = command(ctx.message.text);

  const repoName = extractRepoName(data?.repoUrl);
  if (!success || !repoName) {
    return await ctx.md.replyToMessage(ctx.t("cmd_addrepo_help"));
  }

  const { repoUrl } = data;

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

  return await ctx.md.replyToMessage(ctx.t("cmd_addrepo"));
}

export const cmdAddRepo = new Command<BotContext>("addrepo", "🛡 Add a repository").addToScope(
  { type: "chat_administrators", chat_id: config.bot.chatId },
  addrepoHandler,
);
