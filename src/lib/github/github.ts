import { config } from "#config";
import { Octokit } from "octokit";

const githubRepoUrlRegex = /^https:\/\/github\.com\/([\w-]+\/[\w\-.]+)$/;

export function isGitHubUrl(url: string): boolean {
  return githubRepoUrlRegex.test(url);
}

export function gitHubRepoName(url: string): string | null {
  if (!url) return null;

  const res = url.match(githubRepoUrlRegex);

  if (!res) return null;
  else if (!res[1]) return null;

  return res[1];
}

// TODO: Unexport it and write wrappers.
export const octokit = new Octokit({ auth: config.github.token });
