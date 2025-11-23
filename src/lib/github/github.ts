import { config } from "#config";
import { Octokit } from "octokit";

const githubRepoUrlRegex = /^https:\/\/github\.com\/(?<name>[\w-]+\/[\w\-.]+)$/;

export function extractRepoName(url: string | undefined): string | undefined {
  const res = url?.match(githubRepoUrlRegex);
  const name = res?.groups?.name;

  if (!name) return;
  return name;
}

// TODO: Unexport it and write wrappers.
export const octokit = new Octokit({ auth: config.github.token });
