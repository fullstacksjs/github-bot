declare namespace NodeJS {
  interface ProcessEnv {
    // Telegram Bot variables
    BOT_TOKEN?: string;
    BOT_CHAT_ID?: string;
    BOT_TOPIC_ID?: string;

    // GitHub Application variables
    GITHUB_TOKEN?: string;

    // Database Application variables
    DB_FILE_PATH?: string;
  }
}
