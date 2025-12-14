import type { Context } from "grammy";

import type { BotContext } from "../bot.ts";

export const markup = async (ctx: BotContext, next: () => Promise<unknown>) => {
  ctx.html = {} as BotContext["html"];

  ctx.html.reply = (...args: Parameters<Context["reply"]>): ReturnType<Context["reply"]> => {
    const [, options] = args;
    return ctx.reply(args[0], {
      ...(options ?? {}),
      link_preview_options: {
        is_disabled: true,
        ...(options?.link_preview_options ?? {}),
      },
      parse_mode: "HTML",
    });
  };

  ctx.html.replyToMessage = (...args: Parameters<Context["reply"]>): ReturnType<Context["reply"]> => {
    const [, options] = args;
    return ctx.html.reply(args[0], {
      ...(options ?? {}),
      reply_to_message_id: ctx.update.message?.message_id,
    });
  };

  ctx.replyToMessage = (...args: Parameters<Context["reply"]>): ReturnType<Context["reply"]> => {
    const [, options] = args;
    return ctx.reply(args[0], {
      ...(options ?? {}),
      link_preview_options: {
        is_disabled: true,
        ...(options?.link_preview_options ?? {}),
      },
      parse_mode: "HTML",
      reply_to_message_id: ctx.update.message?.message_id,
    });
  };

  return next();
};

export interface MarkupContext {
  replyToMessage: Context["reply"];
  html: {
    replyToMessage: Context["reply"];
    reply: Context["reply"];
  };
}
