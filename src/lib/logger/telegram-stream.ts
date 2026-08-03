import { autoRetry } from "@grammyjs/auto-retry";
import { config } from "#config";
import { Api } from "grammy";

import type { LogRecord } from "./format.ts";

import { sendReport } from "../telegram/report.ts";
import { formatLogForTelegram } from "./format.ts";

/** Records are dropped once this many sends are in flight, so logging never becomes a memory leak. */
const MAX_PENDING = 100;

/**
 * A pino destination that mirrors records into the Telegram debug chat.
 *
 * It talks to Telegram through its own {@link Api} instance rather than the bot,
 * so that every module — the bot included — can depend on the logger.
 *
 * Sends are serialized to keep records in order and within Telegram's rate
 * limits. Failures go to stderr instead of the logger, otherwise a failing chat
 * would log itself in a loop.
 */
export function createTelegramStream() {
  const api = new Api(config.bot.token);
  api.config.use(autoRetry({ maxRetryAttempts: 2 }));

  let queue = Promise.resolve();
  let pending = 0;

  return {
    write(line: string) {
      if (pending >= MAX_PENDING) return;

      let record: LogRecord;
      try {
        record = JSON.parse(line) as LogRecord;
      } catch {
        return;
      }

      pending += 1;
      const message = formatLogForTelegram(record);

      queue = queue
        .then(() => sendReport(api, message))
        .then(
          () => undefined,
          (error: unknown) => {
            process.stderr.write(`failed to send log to telegram: ${String(error)}\n`);
          },
        )
        .finally(() => {
          pending -= 1;
        });
    },
  };
}
