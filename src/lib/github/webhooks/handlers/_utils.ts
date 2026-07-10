import type { TranslationVariables } from "@grammyjs/i18n";
import type { components } from "@octokit/openapi-webhooks-types";

import { bot } from "#bot";
import { db, schema } from "#db";

import { escapeHtml } from "../../../escape-html.ts";

export interface User {
  ghUsername: string;
  ghProfileUrl: string;
  ghDisplayname: string;
  tgId?: number | null;
  tgUsername?: string | null;
  tgDisplayName?: string | null;
  telegramStatus: string;
}

type SimpleUser = Pick<components["schemas"]["simple-user"], "html_url" | "login" | "name">;

export function botText(key: string, variables?: TranslationVariables<string> | undefined): string {
  return bot.i18n.t("en", key, variables);
}

export function getRepoHashtag(repoFullName: string): string {
  return `#${repoFullName.replace(/[-/]/g, "_").replace(/\./g, "")}`;
}

export async function isRepositoryAccepted(repo: string): Promise<boolean> {
  const resp = await db.query.repositories.findFirst({
    where: (f, o) => o.eq(f.name, repo),
  });

  return !resp?.isBlacklisted;
}

export async function isUserMuted(githubUsername: string): Promise<boolean> {
  const contributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.ghUsername, githubUsername),
  });

  return !!contributor?.isMuted;
}

export async function getUser(githubUser: SimpleUser): Promise<User> {
  const ghUsername = githubUser.login;

  const contributor = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.ghUsername, ghUsername),
  });

  if (!contributor) {
    await db.insert(schema.contributors).values({ ghUsername });
  }

  let telegramStatus = "(-)";
  const isLinked = contributor?.tgId || contributor?.tgUsername;
  if (isLinked) {
    if (contributor.tgUsername) {
      telegramStatus = `(@${escapeHtml(contributor.tgUsername)})`;
    } else if (contributor.tgName) {
      telegramStatus = `(<a href="tg://user?id=${contributor.tgId}">${escapeHtml(contributor.tgName)}</a>)`;
    } else {
      telegramStatus = `(<a href="tg://user?id=${contributor.tgId}">-</a>)`;
    }
  }

  return {
    ghUsername,
    ghProfileUrl: githubUser.html_url,
    ghDisplayname: githubUser.name ?? ghUsername,
    tgId: contributor?.tgId,
    tgUsername: contributor?.tgUsername,
    tgDisplayName: contributor?.tgName,
    telegramStatus,
  };
}
