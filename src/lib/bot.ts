import type { I18nFlavor } from "@grammyjs/i18n";
import type { Context, ErrorHandler } from "grammy";

import { I18n } from "@grammyjs/i18n";
import { limit } from "@grammyjs/ratelimiter";
import { Bot as GrammyBot, GrammyError, HttpError } from "grammy";

import { config } from "../config";

export type BotContext = Context & I18nFlavor;

export class Bot extends GrammyBot<BotContext> {
  constructor() {
    super(config.bot.token);

    const i18n = new I18n<BotContext>({ defaultLocale: "en", directory: "locales" });

    this.use(i18n);
    this.use(
      limit({
        limit: 10,
        timeFrame: 10_000,
        onLimitExceeded: async (ctx) => {
          await ctx.reply(ctx.t("ratelimiter_onLimitExceeded"));
        },
      }),
    );
  }

  /**
   * Sends the text message to the configured chat.
   *
   * @param text The message to be announced.
   * @param chatId ID of the chat for the message to get announced in. default: `config.bot.chatId`
   * @param topicId ID of the chat topic for the message to get announced in. default: `config.bot.topicId`
   */
  public async announce(text: string, chatId?: number, topicId?: number) {
    await this.api.sendMessage(chatId ?? config.bot.chatId, text, {
      direct_messages_topic_id: topicId ?? config.bot.topicId,
      parse_mode: "MarkdownV2",
    });
  }

  // TODO: Use `pinia` for logging instead.
  override errorHandler: ErrorHandler = (err) => {
    // eslint-disable-next-line no-console
    const logErr = console.error;

    logErr(`Error while handling update ${err.ctx.update.update_id}:`);

    const e = err.error;
    if (e instanceof GrammyError) {
      logErr("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      logErr("Could not contact Telegram:", e);
    } else {
      logErr("Unknown error:", e);
    }
  };
}
