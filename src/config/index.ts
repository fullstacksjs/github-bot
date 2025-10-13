/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Config } from "@fullstacksjs/config";
import { env } from "node:process";

const schema = new Config({
  bot: Config.object({
    token: Config.string().required(),
    chatId: Config.number().required(),
    topicId: Config.number(),
  }).required(),

  github: Config.object({
    token: Config.string().required(),
  }).required(),

  database: Config.object({
    filePath: Config.string({ default: "file:database.sqlite" }),
  }),
});

const rawConfig = schema
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

// NOTE: This is a temporary workaround until the issue with undefined fields gets fixed.
export const config = {
  bot: {
    token: { ...rawConfig.bot.token, value: rawConfig.bot.token.value! },
    chatId: { ...rawConfig.bot.chatId, value: rawConfig.bot.chatId.value! },
    topicId: rawConfig.bot.topicId.value,
  },
  github: {
    token: { ...rawConfig.github.token, value: rawConfig.github.token.value! },
  },
  database: rawConfig.database,
} as const;
