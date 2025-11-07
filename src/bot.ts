import { bot } from "./lib/bot";

bot.command("start", async (ctx) => {
  await ctx.reply(ctx.t("command_start", { firstName: ctx.from?.first_name ?? "Unknown User" }));
});
