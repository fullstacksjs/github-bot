import type { StreamEntry } from "pino";

import { config } from "#config";
import pino from "pino";

import { createTelegramStream } from "./telegram-stream.ts";

const logLevels = ["trace", "debug", "info", "warn", "error", "fatal", "silent"] as const;

export type LogLevel = (typeof logLevels)[number];

function toLevel(value: string, fallback: LogLevel): LogLevel {
  return logLevels.includes(value as LogLevel) ? (value as LogLevel) : fallback;
}

function levelValue(level: LogLevel): number {
  return level === "silent" ? Number.POSITIVE_INFINITY : pino.levels.values[level];
}

const outputLevel = toLevel(config.logger.level, "info");
const telegramLevel = toLevel(config.logger.telegramLevel, "info");

const streams: StreamEntry[] = [];

if (outputLevel !== "silent") {
  streams.push(
    { level: outputLevel, stream: pino.destination({ dest: 1, sync: true }) },
    { level: outputLevel, stream: pino.destination({ dest: config.logger.filePath, mkdir: true, sync: true }) },
  );
}

// Without a report chat there is nowhere to mirror records to.
if (telegramLevel !== "silent" && config.bot.reportChatId) {
  streams.push({ level: telegramLevel, stream: createTelegramStream() });
}

/** The lowest level any destination asks for; anything below it is never emitted. */
const rootLevel = streams
  .map((stream) => stream.level as LogLevel)
  .reduce((lowest, level) => (levelValue(level) < levelValue(lowest) ? level : lowest), "silent" as LogLevel);

/** Application-wide logger, writing to stdout, the log file and the Telegram debug chat. */
export const logger = pino({ level: rootLevel }, pino.multistream(streams));

/** Telegram bot activity: incoming updates, commands and their failures. */
export const botLogger = logger.child({ scope: "bot" });

/** GitHub activity: received webhook deliveries and their failures. */
export const githubLogger = logger.child({ scope: "github" });

/** HTTP layer: server lifecycle and rejected requests. */
export const apiLogger = logger.child({ scope: "api" });
