import { levels } from "pino";
import { describe, expect, it } from "vitest";

import type { LogRecord } from "./format.ts";

import { formatLogForTelegram } from "./format.ts";

function record(overrides: Partial<LogRecord> = {}): LogRecord {
  return { level: levels.values.info, time: 0, ...overrides };
}

describe("formatLogForTelegram", () => {
  it("renders the level, scope and message", () => {
    const message = formatLogForTelegram(record({ scope: "bot", msg: "command received" }));

    expect(message).toContain("<b>INFO</b> · <code>bot</code>");
    expect(message).toContain("command received");
    expect(message).toContain("#bot");
  });

  it("escapes the message and the context values", () => {
    const message = formatLogForTelegram(record({ msg: "<b>hi</b>", text: "a & b" }));

    expect(message).toContain("&lt;b&gt;hi&lt;/b&gt;");
    expect(message).toContain("text: <code>a &amp; b</code>");
  });

  it("renders errors with a level tag", () => {
    const message = formatLogForTelegram(
      record({ level: levels.values.error, scope: "github", err: { stack: "Error: boom" }, tags: ["webhook"] }),
    );

    expect(message).toContain("<pre>Error: boom</pre>");
    expect(message).toContain("#webhook #github #error");
  });

  it("uses a pre-rendered body instead of the generic layout", () => {
    const message = formatLogForTelegram(record({ msg: "ignored", tg: "<b>Custom:</b>", deliveryId: "1" }));

    expect(message).toContain("<b>Custom:</b>");
    expect(message).not.toContain("ignored");
    expect(message).not.toContain("deliveryId");
  });

  it("keeps messages within Telegram's limit", () => {
    const message = formatLogForTelegram(record({ msg: "x".repeat(10_000) }));

    expect(message.length).toBeLessThanOrEqual(4096);
  });
});
