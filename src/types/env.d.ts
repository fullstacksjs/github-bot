declare namespace NodeJS {
  interface ProcessEnv {
    // API variables
    API_PORT?: string;

    // Telegram Bot variables
    BOT_TOKEN?: string;
    BOT_CHAT_ID?: string;
    BOT_TOPIC_ID?: string;
    BOT_ADMIN_IDS?: string;
    BOT_WEBHOOK_URL?: string;
    BOT_WEBHOOK_SECRET?: string;

    // GitHub Application variables
    GITHUB_TOKEN?: string;
    GITHUB_ORG_NAME?: string;
    GITHUB_WEBHOOK_SECRET?: string;

    // Database Application variables
    DB_FILE_PATH?: string;
  }
}
