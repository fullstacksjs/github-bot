import * as t from "drizzle-orm/sqlite-core";

export const repositoriesTable = t.sqliteTable(
  "repositories",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    name: t.text().notNull().unique(),
    htmlUrl: t.text().notNull(),
    isBlacklisted: t.integer({ mode: "boolean" }).notNull().default(false),
  },
  (self) => [t.index("idx_repository_name").on(self.name)],
);

export const contributorsTable = t.sqliteTable(
  "contributors",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    ghUsername: t.text().notNull().unique(),
    tgId: t.int(), // Don't unique tgId as some people might have multiple GitHub accounts
    tgName: t.text(),
    tgUsername: t.text(),
  },
  (self) => [t.index("idx_contributors_gh").on(self.ghUsername)],
);

export const repositoryContributorsTable = t.sqliteTable(
  "repository_contributors",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    repositoryId: t
      .int()
      .notNull()
      .references(() => repositoriesTable.id, { onDelete: "cascade" }),
    contributorId: t
      .int()
      .notNull()
      .references(() => contributorsTable.id, { onDelete: "cascade" }),
    contributions: t.int(),
  },
  (self) => [t.uniqueIndex("idx_unique_repo_contributor").on(self.repositoryId, self.contributorId)],
);
