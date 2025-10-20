/* eslint-disable no-console */
import { config } from "../src/config";
import { contributorsTable, db, repositoriesTable, repositoryContributorsTable } from "../src/db";
import { octokit } from "../src/lib/github";

async function saveContributors(owner: string, repo: string, repositoryId: number) {
  const contributorsPaginator = octokit.paginate.iterator("GET /repos/{owner}/{repo}/contributors", {
    owner,
    repo,
    per_page: 100,
  });

  for await (const contributors of contributorsPaginator) {
    for await (const contributor of contributors.data) {
      const ghUsername = contributor.login ?? contributor.name ?? contributor.id?.toString(10) ?? "unknown";

      const res = await db
        .insert(contributorsTable)
        .values({ ghUsername })
        // Just to make `returning` work.
        .onConflictDoUpdate({ target: contributorsTable.ghUsername, set: { ghUsername } })
        .returning({ id: contributorsTable.id });

      if (res.length < 1) throw new Error("failed to insert the contributor");

      console.info(`saved contributor: ${ghUsername}`);

      await db
        .insert(repositoryContributorsTable)
        .values({
          repositoryId,
          contributorId: res[0].id,
          contributions: contributor.contributions,
        })
        .onConflictDoUpdate({
          target: [repositoryContributorsTable.repositoryId, repositoryContributorsTable.contributorId],
          set: { contributions: contributor.contributions },
        });

      console.info(`saved repository contributions: ${ghUsername} | ${contributor.contributions}`);
    }
  }
}

async function saveRepos(org: string) {
  const reposPaginator = octokit.paginate.iterator("GET /orgs/{org}/repos", {
    org,
    per_page: 100,
    sort: "created",
    direction: "asc",
    type: "all",
  });

  for await (const repos of reposPaginator) {
    for await (const repo of repos.data) {
      const res = await db
        .insert(repositoriesTable)
        .values({ name: repo.full_name, htmlUrl: repo.html_url })
        // Just to make `returning` work.
        .onConflictDoUpdate({ target: repositoriesTable.name, set: { htmlUrl: repo.html_url } })
        .returning({ id: repositoriesTable.id });

      if (res.length < 1) throw new Error("failed to insert the repository");

      console.info(`saved repository: ${repo.full_name}`);

      const ownerName = repo.owner.name ?? repo.full_name.split("/")[0];
      await saveContributors(ownerName, repo.name, res[0].id);
    }
  }
}

const start = Date.now();
await saveRepos(config.github.orgName);
const end = Date.now();

console.info(`saved everything in ${(end - start) / 1000}s`);
