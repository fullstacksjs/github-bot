import type { BotContext } from "#bot";

import { botLogger } from "#logger";
import { GrammyError } from "grammy";

import { formatErrorDetails } from "../../lib/error-details.ts";
import { escapeHtml } from "../../lib/escape-html.ts";

function buildErrorReport(ctx: BotContext, error: unknown): string {
  const update = ctx.update.message;
  const command = update?.text ? escapeHtml(update.text) : "N/A";
  const firstName = update?.from?.first_name ? escapeHtml(update.from.first_name) : "Unknown";
  const link = update?.from?.username
    ? `@${escapeHtml(update.from.username)}`
    : `<a href="tg://user?id=${update?.from?.id}">${firstName}</a>`;

  const details = error instanceof GrammyError ? error.description : formatErrorDetails(error);

  return [
    `Command: <code>${command}</code>`,
    `Sender Name: ${link}`,
    "",
    "<b>Message:</b>",
    "",
    `<pre>${escapeHtml(details)}</pre>`,
  ].join("\n");
}

export const logger = async (ctx: BotContext, next: () => Promise<unknown>) => {
  ctx.logger = botLogger.child({
    updateId: ctx.update.update_id,
    chatId: ctx.chat?.id,
    userId: ctx.from?.id,
    username: ctx.from?.username,
  });

  ctx.report = (error: unknown) => {
    ctx.logger.error({ err: error, tg: buildErrorReport(ctx, error) }, "command failed");
  };

  ctx.logger.debug({ text: ctx.update.message?.text }, "update received");

  return next();
};

export interface LoggerContext {
  /** Logger bound to the current update. */
  logger: typeof botLogger;
  /** Reports an error to the log file and the Telegram debug chat. */
  report: (error: unknown) => void;
}
