import { relations } from "drizzle-orm";

import { contributors, repositories, repositoryContributors } from "./tables";

export const repositoriesRelations = relations(repositories, ({ many }) => ({
  contributors: many(repositoryContributors),
}));

export const contributorsRelations = relations(contributors, ({ many }) => ({
  contributions: many(repositoryContributors),
}));

export const repositoryContributorsRelations = relations(repositoryContributors, ({ one }) => ({
  repository: one(repositories, {
    fields: [repositoryContributors.repositoryId],
    references: [repositories.id],
  }),
  contributor: one(contributors, {
    fields: [repositoryContributors.contributorId],
    references: [contributors.id],
  }),
}));
