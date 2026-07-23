import type { BotContext } from "#bot";

export const helpers = async (ctx: BotContext, next: () => Promise<unknown>) => {
  if (!ctx.message) return next();

  const repliedMessage = ctx.message.reply_to_message;
  const isActualReply = Boolean(repliedMessage && !repliedMessage.forum_topic_created);
  const isReplyToBot = isActualReply && repliedMessage?.from?.id === ctx.me.id;

  ctx.isReply = isActualReply;
  ctx.isReplyToBot = isReplyToBot;

  return next();
};

export interface HelperContext {
  isReply: boolean;
  isReplyToBot: boolean;
}
