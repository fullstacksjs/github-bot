import { Octokit } from "octokit";

import { config } from "../config";

// TODO: Unexport it and write wrappers.
export const octokit = new Octokit({ auth: config.github.token });
