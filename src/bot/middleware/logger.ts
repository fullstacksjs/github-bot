/* eslint-disable no-console */
import type { BotContext } from "#bot";

import { config } from "#config";
import { GrammyError } from "grammy";

export const logger = async (ctx: BotContext, next: () => Promise<unknown>) => {
  ctx.logger = {
    log: async (message: string) => {
      console.log(message);
      const reportId = config.bot.reportChatId;
      if (!reportId) return;

      return ctx.api.sendMessage(reportId, message, { parse_mode: "HTML" });
    },
    error: async (message: string) => {
      console.log("Report for", config.bot.reportChatId);

      console.error(message);
      const reportId = config.bot.reportChatId;
      if (!reportId) return;

      return ctx.api.sendMessage(reportId, message, { parse_mode: "HTML" });
    },
  };

  ctx.report = async (e: unknown) => {
    let message = "";
    const update = ctx.update.message;
    const link = update?.from.username
      ? `@${update.from.username}`
      : `<a href="tg://user?id=${update?.from.id}">${update?.from.first_name}</a>`;

    message += [
      "<b>Error:</b>",
      `Command: <code>${update?.text}</code>`,
      `Sender Name: ${link}`,
      "",
      "<b>Message:</b>",
      "",
    ].join("\n");

    if (e instanceof GrammyError) {
      message += `<pre>${e.description}</pre>\n`;
    } else {
      message += `<pre>${e}</pre>\n`;
    }

    message += `\n#error`;

    ctx.logger.error(message);
  };

  return next();
};

export interface LoggerContext {
  logger: {
    log: (log: string) => Promise<unknown> | undefined;
    error: (error: string) => Promise<unknown> | undefined;
  };
  report: (error: unknown) => Promise<unknown> | undefined;
}
