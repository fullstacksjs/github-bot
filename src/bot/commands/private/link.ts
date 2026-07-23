import type { SQLiteInsertValue, SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core";
import type { MessageEntity, User } from "grammy/types";

import { config } from "#config";
import { db, schema as s } from "#db";
import { createCommand, extractGitHubUsername, zs } from "#telegram";
import z from "zod";

import type { BotContext } from "../../bot.ts";

import { toTelegramFullName } from "../../../lib/telegram/telegram-user.ts";

const schema = z.object({
  username: z.string().min(1),
  tgUsername: zs.tgUsername.optional(),
});

type GitHubUsername = z.infer<typeof zs.ghUsername>;
type TelegramUsername = z.infer<typeof zs.tgUsername>;
type ResolvedLinkArguments =
  | { error: "cmd_link_help" | "cmd_link_no_github_user" }
  | { ghUsername: GitHubUsername; tgUsername: TelegramUsername | undefined };

function resolveLinkArguments(
  args: z.infer<typeof schema>,
  isReplyToBot: boolean,
  entities: readonly MessageEntity[] | undefined,
): ResolvedLinkArguments {
  if (!isReplyToBot) {
    const result = zs.ghUsername.safeParse(args.username);
    return result.success ? { ghUsername: result.data, tgUsername: args.tgUsername } : { error: "cmd_link_help" };
  }

  if (args.tgUsername) return { error: "cmd_link_help" };

  const telegramResult = zs.tgUsername.safeParse(args.username);
  if (!telegramResult.success) return { error: "cmd_link_help" };

  const ghUsername = extractGitHubUsername(entities);
  if (!ghUsername) return { error: "cmd_link_no_github_user" };

  return { ghUsername, tgUsername: telegramResult.data };
}

function getTelegramTarget(from: User | undefined, tgUsername: TelegramUsername | undefined) {
  const target = {
    tgId: from?.id ?? null,
    tgName: from ? toTelegramFullName(from) : null,
    tgUsername,
  };

  if (from?.username) {
    const result = zs.tgUsername.safeParse(from.username);
    if (result.success) target.tgUsername = result.data;
  }

  return target;
}

function getContributorValues(ghUsername: GitHubUsername, target: ReturnType<typeof getTelegramTarget>) {
  const set: SQLiteInsertValue<typeof s.contributors> = { ghUsername };
  if (target.tgId) set.tgId = target.tgId;
  if (target.tgName) set.tgName = target.tgName;
  if (target.tgUsername) set.tgUsername = target.tgUsername;
  return set;
}

export async function handler(ctx: BotContext<z.infer<typeof schema>>) {
  const repliedMessage = ctx.message.reply_to_message;
  const entities = repliedMessage && "entities" in repliedMessage ? repliedMessage.entities : undefined;

  const resolved = resolveLinkArguments(ctx.args, ctx.isReplyToBot, entities);

  if ("error" in resolved) return await ctx.html.replyToMessage(ctx.t(resolved.error));

  const from = ctx.isReply && !ctx.isReplyToBot ? repliedMessage?.from : undefined;
  const target = getTelegramTarget(from, resolved.tgUsername);

  if (!target.tgId && !target.tgUsername) {
    return await ctx.html.replyToMessage(ctx.t("cmd_link_no_user"));
  }

  const set = getContributorValues(resolved.ghUsername, target);

  await db
    .insert(s.contributors)
    .values(set)
    .onConflictDoUpdate({
      target: s.contributors.ghUsername,
      set: set as SQLiteUpdateSetSource<typeof s.contributors>,
    });

  if (ctx.isReplyToBot) {
    return await ctx.html.replyToMessage(
      ctx.t("cmd_link_event", {
        ghUsername: resolved.ghUsername,
        tgUsername: `@${target.tgUsername}`,
      }),
    );
  }

  return await ctx.html.replyToMessage(ctx.t("cmd_link"));
}

export const cmdLink = createCommand({
  template: "link $username $tgUsername",
  description: "🛡 Link Telegram and GitHub accounts",
  handler,
  schema,
  helpMessage: (t) => t("cmd_link_help"),
  scopes: [{ type: "chat_administrators", chat_id: config.bot.chatId }],
});
