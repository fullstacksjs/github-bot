import type { I18nFlavor } from "@grammyjs/i18n";
import type { Context, ErrorHandler } from "grammy";

import { autoRetry } from "@grammyjs/auto-retry";
import { I18n } from "@grammyjs/i18n";
import { limit } from "@grammyjs/ratelimiter";
import { Bot as GrammyBot, GrammyError, HttpError } from "grammy";

import { config } from "@/config";

/** BotContext is the context passed to the update handlers after passing all middlewares. */
export type BotContext = Context & I18nFlavor;

interface AnnounceChat {
  /** Numeric id of the chat */
  chatId: number;
  /** Optional. Numeric id of the chat's topic */
  topicId?: number | undefined;
}

/** BotOptions is the constructor options of Bot class */
interface BotOptions {
  /** Telegram bot's token */
  token: string;

  /** Default channel to announce updates in */
  announceChat: AnnounceChat;
}

/**
 * Bot extends GrammY's Bot by doing the bootstrap steps in constructor level.
 */
export class Bot extends GrammyBot<BotContext> {
  i18n = new I18n<BotContext>({
    defaultLocale: "en",
    directory: "locales",
    fluentBundleOptions: {
      useIsolating: false,
    },
  });

  /** Default chat used to announce messages in */
  private announceChat: AnnounceChat;

  /**
   * @param options bot options required to make the bot work.
   */
  constructor({ token, announceChat }: BotOptions) {
    super(token);
    this.announceChat = announceChat;

    this.use(this.i18n);
    this.use(
      limit({
        limit: 10,
        timeFrame: 10_000,
        onLimitExceeded: async (ctx) => {
          await ctx.reply(ctx.t("ratelimiter_onLimitExceeded"));
        },
      }),
    );

    this.api.config.use(autoRetry());
  }

  /**
   * Sends the text message to the configured chat.
   *
   * @param text The message to be announced.
   * @param chatId ID of the chat for the message to get announced in. default: `config.bot.chatId`
   * @param topicId ID of the chat topic for the message to get announced in. default: `config.bot.topicId`
   */
  public async announce(text: string, other?: Parameters<typeof this.api.sendMessage>[2], chat?: AnnounceChat) {
    await this.api.sendMessage(chat?.chatId ?? this.announceChat.chatId, text, {
      direct_messages_topic_id: chat?.topicId ?? this.announceChat.topicId,
      parse_mode: "MarkdownV2",
      ...other,
    });
  }

  // TODO: Use a better way of logging error
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

/** bot is just an instance of Bot with options passed from the config */
export const bot = new Bot({
  token: config.bot.token,
  announceChat: {
    chatId: config.bot.chatId,
    topicId: config.bot.topicId,
  },
});
