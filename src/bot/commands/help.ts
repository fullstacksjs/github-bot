import { config } from "#config";
import { createCommand } from "#telegram";

import type { BotContext } from "../bot.ts";

export async function handler(ctx: BotContext) {
  const isAdmin = config.bot.adminIds.includes(ctx.message.from.id);

  return await ctx.replyToMessage(ctx.t(isAdmin ? "cmd_help_admin" : "cmd_help"));
}

export const cmdHelp = createCommand({
  template: "help",
  description: "About This Bot",
  handler,
});
