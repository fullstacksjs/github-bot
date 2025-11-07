import { commands } from "./commands";
import { bot } from "./lib/bot";

await commands.setCommands(bot);

bot.use(commands);

bot.start({
  onStart(botInfo) {
    // eslint-disable-next-line no-console
    console.log(`Bot started as @${botInfo.username}`);
  },
});
