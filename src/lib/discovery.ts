import { config } from "@/config";
import { db, schema } from "@/db";
import { octokit } from "@/github";

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
        .insert(schema.contributors)
        .values({ ghUsername })
        // Just to make `returning` work.
        .onConflictDoUpdate({ target: schema.contributors.ghUsername, set: { ghUsername } })
        .returning({ id: schema.contributors.id });

      if (res.length < 1) throw new Error("failed to insert the contributor");

      await db
        .insert(schema.repositoryContributors)
        .values({
          repositoryId,
          contributorId: res[0].id,
          contributions: contributor.contributions,
        })
        .onConflictDoUpdate({
          target: [schema.repositoryContributors.repositoryId, schema.repositoryContributors.contributorId],
          set: { contributions: contributor.contributions },
        });
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
        .insert(schema.repositories)
        .values({ name: repo.full_name, htmlUrl: repo.html_url })
        // Just to make `returning` work.
        .onConflictDoUpdate({ target: schema.repositories.name, set: { htmlUrl: repo.html_url } })
        .returning({ id: schema.repositories.id });

      if (res.length < 1) throw new Error("failed to insert the repository");

      const ownerName = repo.owner.name ?? repo.full_name.split("/")[0];
      await saveContributors(ownerName, repo.name, res[0].id);
    }
  }
}

export async function startDiscovery() {
  const start = Date.now();
  await saveRepos(config.github.orgName);
  const end = Date.now();

  const duration = end - start;

  return duration;
}
