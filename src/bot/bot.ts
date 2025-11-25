import type { I18nFlavor } from "@grammyjs/i18n";
import type { Context, ErrorHandler } from "grammy";

import { autoRetry } from "@grammyjs/auto-retry";
import { I18n } from "@grammyjs/i18n";
import { limit } from "@grammyjs/ratelimiter";
import { config } from "#config";
import { Bot as GrammyBot, GrammyError, HttpError } from "grammy";

import type { MarkdownContext } from "./middleware/markdown.ts";

import { adminCommands } from "./commands/private/group.ts";
import { userCommands } from "./commands/public/group.ts";
import { markdown } from "./middleware/markdown.ts";

const defaultChat: AnnounceChat = {
  chatId: config.bot.chatId,
  topicId: config.bot.topicId,
};

/** BotOptions is the constructor options of Bot class */
interface BotOptions {
  /** Telegram bot's token */
  token: string;
}

interface AnnounceChat {
  /** Numeric id of the chat */
  chatId: number;
  /** Optional. Numeric id of the chat's topic */
  topicId?: number | undefined;
}

export type BotContext<Args = Record<string, never>> = Context &
  I18nFlavor &
  MarkdownContext & {
    args: Args;
  } & {
    message: {
      text: string;
    };
  };

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

  /**
   * @param options bot options required to make the bot work.
   */
  constructor({ token }: BotOptions) {
    super(token);
    this.use(markdown);
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

    this.use(userCommands);
    this.filter((ctx) => config.bot.adminIds.includes(ctx.message.from.id)).use(adminCommands);
    this.api.config.use(autoRetry({ maxRetryAttempts: 2 }));
  }

  /**
   * Sends the text message to the configured chat.
   *
   * @param text The message to be announced.
   * @param chatId ID of the chat for the message to get announced in. default: `config.bot.chatId`
   * @param topicId ID of the chat topic for the message to get announced in. default: `config.bot.topicId`
   */
  public async announce(text: string, other?: Parameters<typeof this.api.sendMessage>[2], chat = defaultChat) {
    await this.api.sendMessage(chat?.chatId, text, {
      message_thread_id: chat?.topicId,
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

  async setCommands() {
    await Promise.all([userCommands.setCommands(this), adminCommands.setCommands(this)]);
  }

  async setupWebhook({ secret, url }: { url: string; secret: string }) {
    return this.api.setWebhook(url, {
      allowed_updates: ["message"],
      secret_token: secret,
    });
  }
}

export const bot = new Bot({
  token: config.bot.token,
});

bot.catch(bot.errorHandler);
