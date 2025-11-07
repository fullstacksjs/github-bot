import { Config } from "@fullstacksjs/config";
import { env } from "node:process";

const schema = new Config({
  bot: Config.object({
    token: Config.string().required(),
    chatId: Config.number().required(),
    topicId: Config.number(),
    adminIds: Config.array(Config.number({ coerce: true })),
  }),

  github: Config.object({
    token: Config.string().required(),
    orgName: Config.string().required(),
  }),

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
      adminIds: env.BOT_ADMIN_IDS?.split(",").map((v) => parseInt(v.trim(), 10)),
    },
    github: {
      token: env.GITHUB_TOKEN,
      orgName: env.GITHUB_ORG_NAME,
    },
    database: {
      filePath: env.DB_FILE_PATH,
    },
  })
  .getAll();
