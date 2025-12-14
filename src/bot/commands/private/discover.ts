import type { BotContext } from "#bot";

import { config } from "#config";
import { createCommand } from "#telegram";

import { startDiscovery } from "../../../lib/discovery.ts";

export async function handler(ctx: BotContext) {
  const update = await ctx.html.replyToMessage(ctx.t("cmd_discover"));

  startDiscovery().then((rawDuration) => {
    const duration = (rawDuration / 1000).toFixed(2);

    return ctx.api.editMessageText(update.chat.id, update.message_id, ctx.t("cmd_discover_done", { duration }), {
      parse_mode: "HTML",
    });
  });
}

export const cmdDiscover = createCommand({
  template: "discover",
  description: "🛡 Update the repository database",
  handler,
  scopes: [{ type: "chat_administrators", chat_id: config.bot.chatId }],
});
