import assert from "node:assert";
import test from "node:test";
import zod from "zod";

import { CommandParser } from "./CommandParser.ts";

test("CommandParser parses command arguments correctly", () => {
  const parser = CommandParser(
    "/link $repoUrl $ghUsername",
    zod.object({
      ghUsername: zod.string(),
      repoUrl: zod.url(),
    }),
  );
  const { success, data } = parser("/link https://github.com/ASafaeirad/repo ASafaeirad");
  assert.ok(success);
  assert.equal(data.ghUsername, "ASafaeirad");
  assert.equal(data.repoUrl, "https://github.com/ASafaeirad/repo");
});

test("CommandParser returns failure on invalid input", () => {
  const parser = CommandParser(
    "/link $repoUrl $ghUsername",
    zod.object({
      ghUsername: zod.string(),
      repoUrl: zod.url(),
    }),
  );
  const { success } = parser("/link invalid-url ASafaeirad");
  assert.ok(!success);
});
