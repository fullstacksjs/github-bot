import { Config } from "@fullstacksjs/config";
import { env } from "node:process";

const schema = new Config({
  api: Config.object({
    port: Config.number({ default: 8080 }),
  }),

  bot: Config.object({
    token: Config.string().required(),
    chatId: Config.number().required(),
    topicId: Config.number(),
    adminIds: Config.array(Config.number({ coerce: true })),
    webhookUrl: Config.string().required(),
    webhookSecret: Config.string().required(),
  }),

  github: Config.object({
    token: Config.string().required(),
    orgName: Config.string().required(),
    webhookSecret: Config.string().required(),
  }),

  database: Config.object({
    filePath: Config.string({ default: "file:database.sqlite" }),
  }),
});

export const config = schema
  .parse({
    api: {
      port: env.API_PORT,
    },
    bot: {
      token: env.BOT_TOKEN,
      chatId: env.BOT_CHAT_ID,
      topicId: env.BOT_TOPIC_ID,
      adminIds: env.BOT_ADMIN_IDS?.split(",").map((v) => parseInt(v.trim(), 10)),
      webhookUrl: env.BOT_WEBHOOK_URL,
      webhookSecret: env.BOT_WEBHOOK_SECRET,
    },
    github: {
      token: env.GITHUB_TOKEN,
      orgName: env.GITHUB_ORG_NAME,
      webhookSecret: env.GITHUB_WEBHOOK_SECRET,
    },
    database: {
      filePath: env.DB_FILE_PATH,
    },
  })
  .getAll();
