import { levels } from "pino";

import { escapeHtml } from "../escape-html.ts";

/** Telegram caps messages at 4096 characters, leave room for the header. */
const MAX_MESSAGE_LENGTH = 3800;
const MAX_DETAILS_LENGTH = 2500;

/** Keys owned by pino or handled explicitly, never rendered as context lines. */
const reservedKeys = new Set(["err", "hostname", "level", "msg", "name", "pid", "scope", "tags", "tg", "time"]);

const levelIcons: Record<string, string> = {
  trace: "🔬",
  debug: "🐞",
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
  fatal: "💀",
};

export interface LogRecord {
  level: number;
  time: number;
  msg?: string;
  /** Logical area of the app, e.g. `bot` or `github`. */
  scope?: string;
  /** Pre-rendered, already escaped HTML body used instead of the generic layout. */
  tg?: string;
  /** Extra hashtags appended to the Telegram message. */
  tags?: string[];
  err?: { type?: string; message?: string; stack?: string };
  [key: string]: unknown;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}\n…` : text;
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

function getTags(record: LogRecord, label: string): string {
  const tags = new Set(record.tags ?? []);
  if (record.scope) tags.add(record.scope);
  if (label === "error" || label === "fatal" || label === "warn") tags.add(label);

  return [...tags].map((tag) => `#${tag.replace(/\W/g, "_")}`).join(" ");
}

function getErrorDetails(err: NonNullable<LogRecord["err"]>): string {
  return err.stack ?? [err.type, err.message].filter(Boolean).join(": ");
}

/** Renders a pino log record as the HTML message sent to the debug chat. */
export function formatLogForTelegram(record: LogRecord): string {
  const label = levels.labels[record.level] ?? "info";
  const scope = record.scope ? ` · <code>${escapeHtml(record.scope)}</code>` : "";
  const lines = [`${levelIcons[label] ?? "ℹ️"} <b>${label.toUpperCase()}</b>${scope}`];

  if (record.tg) {
    lines.push(record.tg);
  } else {
    if (record.msg) lines.push(escapeHtml(record.msg));

    const context = Object.entries(record).filter(([key, value]) => !reservedKeys.has(key) && value != null);
    if (context.length > 0) {
      lines.push("", ...context.map(([key, value]) => `${key}: <code>${escapeHtml(stringifyValue(value))}</code>`));
    }

    if (record.err) {
      lines.push("", `<pre>${escapeHtml(truncate(getErrorDetails(record.err), MAX_DETAILS_LENGTH))}</pre>`);
    }
  }

  const tags = getTags(record, label);
  if (tags) lines.push("", tags);

  return truncate(lines.join("\n"), MAX_MESSAGE_LENGTH);
}
