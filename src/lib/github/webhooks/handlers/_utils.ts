import type { TranslationVariables } from "@grammyjs/i18n";
import type { components } from "@octokit/openapi-webhooks-types";

import { bot } from "#bot";
import { db, schema } from "#db";

export interface User {
  user: string;
  userUrl: string;
}

type SimpleUser = Pick<components["schemas"]["simple-user"], "html_url" | "login" | "name">;

export function botText(key: string, variables?: TranslationVariables<string> | undefined): string {
  return bot.i18n.t("en", key, variables);
}

export async function isRepositoryAccepted(repo: string): Promise<boolean> {
  const resp = await db.query.repositories.findFirst({
    where: (f, o) => o.eq(f.name, repo),
  });

  return !resp?.isBlacklisted;
}

export async function getUser(simpleUser: SimpleUser): Promise<User> {
  const ghUsername = simpleUser.login;

  let user = simpleUser.name ?? ghUsername;
  let userUrl = simpleUser.html_url;

  const dbUser = await db.query.contributors.findFirst({
    where: (f, o) => o.eq(f.ghUsername, ghUsername),
  });

  if (!dbUser?.ghUsername) {
    await db.insert(schema.contributors).values({ ghUsername });
  }

  if (dbUser?.tgId && dbUser?.tgName) {
    user = dbUser.tgName;
    userUrl = `tg://user?id=${dbUser.tgId}`;
  }

  return { user, userUrl };
}
