import { Bot } from "./lib/bot";

export const bot = new Bot();

bot.command("start", async (ctx) => {
  await ctx.reply(ctx.t("command_start", { firstName: ctx.from?.first_name ?? "Unknown User" }));
});
