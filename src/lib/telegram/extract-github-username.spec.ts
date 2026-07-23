import type { MessageEntity } from "grammy/types";

import { expect, test } from "vitest";

import { extractGitHubUsername } from "./extract-github-username.ts";

const textLink = (url: string): MessageEntity => ({
  type: "text_link",
  offset: 0,
  length: 1,
  url,
});

test("extracts a GitHub username from a profile link", () => {
  expect(extractGitHubUsername([textLink("https://github.com/ASafaeirad")])).toBe("ASafaeirad");
});

test("skips repository and activity links before a profile link", () => {
  const entities = [
    textLink("https://github.com/fullstacksjs/github-bot"),
    textLink("https://github.com/fullstacksjs/github-bot/issues/91"),
    textLink("https://github.com/S-Kill"),
  ];

  expect(extractGitHubUsername(entities)).toBe("S-Kill");
});

test("does not extract usernames from non-GitHub or malformed links", () => {
  const entities = [
    textLink("https://example.com/ASafaeirad"),
    textLink("https://github.com/-invalid"),
    textLink("not a URL"),
  ];

  expect(extractGitHubUsername(entities)).toBeUndefined();
});
