import type { MessageEntity } from "grammy/types";

import { ghUsername } from "./schemas.ts";

const isGitHubUrl = (url: URL) => url.protocol === "https:" && url.hostname.toLowerCase() === "github.com";

export function extractGitHubUsername(entities: readonly MessageEntity[] | undefined) {
  if (!entities?.length) return undefined;

  for (const entity of entities) {
    if (entity.type !== "text_link") continue;

    try {
      const url = new URL(entity.url);
      if (!isGitHubUrl(url)) continue;

      const segments = url.pathname.split("/").filter(Boolean);
      if (segments.length !== 1) continue;

      const result = ghUsername.safeParse(segments[0]);
      if (result.success) return result.data;
    } catch {
      return undefined;
    }
  }

  return undefined;
}
