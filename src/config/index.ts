import { Config } from "@fullstacksjs/config";
import { env } from "node:process";

// TODO: Add `required`s back once the upstream issues fixed.
const schema = new Config({
  bot: Config.object({
    token: Config.string(), //.required(),
    chatId: Config.number(), //.required(),
    topicId: Config.number(),
  }).required(),

  github: Config.object({
    token: Config.string(), //.required(),
  }).required(),

  database: Config.object({
    filePath: Config.string({ default: "file:database.sqlite" }),
  }),
});

export const config = schema
  .parse({
    bot: {
      token: env.BOT_TOKEN,
      chatId: env.BOT_CHAT_ID,
      topicId: env.BOT_TOPIC_ID,
    },
    github: {
      token: env.GITHUB_TOKEN,
    },
    database: {
      filePath: env.DB_FILE_PATH,
    },
  })
  .getAll();
