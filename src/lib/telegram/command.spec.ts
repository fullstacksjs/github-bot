import assert from "node:assert";
import { expect, test } from "vitest";
import zod from "zod";

import { CommandParser } from "./CommandParser.ts";

test("commandParser parses command arguments correctly", () => {
  const parser = CommandParser(
    "/link $repoUrl $ghUsername",
    zod.object({
      ghUsername: zod.string(),
      repoUrl: zod.url(),
    }),
  );
  const { success, data } = parser("/link https://github.com/ASafaeirad/repo ASafaeirad");
  assert.ok(success);

  expect(data.ghUsername).toBe("ASafaeirad");
  expect(data.repoUrl).toBe("https://github.com/ASafaeirad/repo");
});

test("commandParser returns failure on invalid input", () => {
  const parser = CommandParser(
    "/link $repoUrl $ghUsername",
    zod.object({
      ghUsername: zod.string(),
      repoUrl: zod.url(),
    }),
  );
  const { success } = parser("/link invalid-url ASafaeirad");

  expect(success).toBe(false);
});
