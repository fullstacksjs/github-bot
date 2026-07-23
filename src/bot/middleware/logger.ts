/* eslint-disable no-console */
import type { BotContext } from "#bot";

import { config } from "#config";
import { GrammyError } from "grammy";

import { formatErrorDetails } from "../../lib/error-details.ts";
import { escapeHtml } from "../../lib/escape-html.ts";
import { sendReport } from "../../lib/telegram/report.ts";

export const logger = async (ctx: BotContext, next: () => Promise<unknown>) => {
  ctx.logger = {
    log: async (message: string) => {
      console.log(message);
      return sendReport(ctx.api, message);
    },
    error: async (message: string) => {
      console.log("Report for", config.bot.reportChatId);

      console.error(message);
      return sendReport(ctx.api, message);
    },
  };

  ctx.report = async (e: unknown) => {
    let message = "";
    const update = ctx.update.message;
    const command = update?.text ? escapeHtml(update.text) : "N/A";
    const firstName = update?.from?.first_name ? escapeHtml(update.from.first_name) : "Unknown";
    const link = update?.from.username
      ? `@${escapeHtml(update.from.username)}`
      : `<a href="tg://user?id=${update?.from.id}">${firstName}</a>`;

    message += [
      "<b>Error:</b>",
      `Command: <code>${command}</code>`,
      `Sender Name: ${link}`,
      "",
      "<b>Message:</b>",
      "",
    ].join("\n");

    if (e instanceof GrammyError) {
      message += `<pre>${escapeHtml(e.description)}</pre>\n`;
    } else {
      message += `<pre>${escapeHtml(formatErrorDetails(e))}</pre>\n`;
    }

    message += `\n#error`;

    return ctx.logger.error(message);
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
