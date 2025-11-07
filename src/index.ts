import { bot } from "./lib/bot";

// NOTE: It's just an experiment to make sure that it's working
// until we start to use it everywhere else.
await bot.announce("I'm up and running again\\!");

bot.start({
  onStart(botInfo) {
    // eslint-disable-next-line no-console
    console.log(`Bot started as @${botInfo.username}`);
  },
});
