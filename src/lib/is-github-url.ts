const githubRepoUrlRegex = /^https:\/\/github\.com\/[\w-]+\/[\w\-.]+$/;

export function isGitHubUrl(url: string): boolean {
  return githubRepoUrlRegex.test(url);
}
