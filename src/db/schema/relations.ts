import { relations } from "drizzle-orm";

import { contributorsTable, repositoriesTable, repositoryContributorsTable } from "./tables";

export const repositoriesRelations = relations(repositoriesTable, ({ many }) => ({
  contributors: many(repositoryContributorsTable),
}));

export const contributorsRelations = relations(contributorsTable, ({ many }) => ({
  contributions: many(repositoryContributorsTable),
}));

export const repositoryContributorsRelations = relations(repositoryContributorsTable, ({ one }) => ({
  repository: one(repositoriesTable, {
    fields: [repositoryContributorsTable.repositoryId],
    references: [repositoriesTable.id],
  }),
  contributor: one(contributorsTable, {
    fields: [repositoryContributorsTable.contributorId],
    references: [contributorsTable.id],
  }),
}));
