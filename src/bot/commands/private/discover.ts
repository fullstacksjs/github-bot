import type { BotContext } from "#bot";

import { config } from "#config";
import { createCommand } from "#telegram";

import { startDiscovery } from "../../../lib/discovery.ts";
import { escapeMarkdown } from "../../../lib/escape-markdown.ts";

export async function handler(ctx: BotContext) {
  const update = await ctx.md.replyToMessage(ctx.t("cmd_discover"));

  startDiscovery().then((rawDuration) => {
    const duration = (rawDuration / 1000).toFixed(2);

    return ctx.api.editMessageText(
      update.chat.id,
      update.message_id,
      ctx.t("cmd_discover_done", { duration: escapeMarkdown(duration) }),
      { parse_mode: "MarkdownV2" },
    );
  });
}

export const cmdDiscover = createCommand({
  template: "discover",
  description: "🛡 Update the repository database",
  handler,
  scopes: [{ type: "chat_administrators", chat_id: config.bot.chatId }],
});
