import type { Context } from "grammy";

import type { BotContext } from "../bot";

export const markdown = async (ctx: BotContext, next: () => Promise<unknown>) => {
  ctx.md = {} as BotContext["md"];

  ctx.md.reply = (...args: Parameters<Context["reply"]>): ReturnType<Context["reply"]> => {
    return ctx.reply(args[0], {
      parse_mode: "MarkdownV2",
      link_preview_options: { is_disabled: true },
      ...args[1],
    });
  };

  ctx.md.replyToMessage = (...args: Parameters<Context["reply"]>): ReturnType<Context["reply"]> => {
    return ctx.md.reply(args[0], { reply_to_message_id: ctx.update.message?.message_id });
  };

  ctx.replyToMessage = (...args: Parameters<Context["reply"]>): ReturnType<Context["reply"]> => {
    return ctx.reply(args[0], { reply_to_message_id: ctx.update.message?.message_id });
  };

  return next();
};

export interface MarkdownContext {
  replyToMessage: Context["reply"];
  md: {
    replyToMessage: Context["reply"];
    reply: Context["reply"];
  };
}
