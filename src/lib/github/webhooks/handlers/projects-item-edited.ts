import type { HandlerFunction } from "@octokit/webhooks/types";

import { bot } from "#bot";

import { escapeHtml } from "../../../escape-html.ts";
import { octokit } from "../../github.ts";
import { botText, getRepoHashtag, getUser } from "./_utils.ts";

interface ProjectItemPayload {
  sender: {
    login: string;
    html_url: string;
  };

  changes: {
    field_value?: {
      field_name: string;
      field_type: string;
      field_node_id: string;
    };
  };

  projects_v2_item: {
    node_id: string;
    content_type: string;
    content_node_id: string;
  };

  organization?: {
    login: string;
  };
  repository?: {
    name: string;
    html_url: string;
  };
}

interface ItemDetails {
  title: string;
  type: string;
  url?: string;
  status: string;
  projectTitle: string;
  repositoryName?: string;
  repositoryUrl?: string;
}

export const projectItemEditedCallback: HandlerFunction<"projects_v2_item.edited", unknown> = async (event) => {
  const payload = event.payload as unknown as ProjectItemPayload;

  const isStatusChanged = payload.changes.field_value?.field_name === "Status";
  if (!isStatusChanged) return;

  const user = await getUser(payload.sender);
  const details = await fetchItemDetails(payload.projects_v2_item.node_id);

  const userUrl = payload.sender.html_url;
  const itemUrl = details.url ?? "";
  const repoName = details.repositoryName ?? details.projectTitle;
  const repoHashtag = details.repositoryName && details.repositoryUrl ? getRepoHashtag(details.repositoryName) : "";

  const typeIcons: Record<string, string> = {
    Issue: "🔘",
    PullRequest: "🌴",
    DraftIssue: "📝",
  };

  await bot.announce(
    botText("e_project_item_status_changed", {
      user: escapeHtml(user.ghDisplayname),
      userUrl: escapeHtml(userUrl),
      telegramStatus: user.telegramStatus,
      projectName: escapeHtml(details.projectTitle),
      repoName: escapeHtml(repoName),
      status: escapeHtml(details.status),
      itemType: escapeHtml(details.type),
      itemTitle: escapeHtml(details.title),
      itemUrl: escapeHtml(itemUrl),
      itemTypeIcon: typeIcons[details.type],
      repoHashtag,
    }),
    {
      link_preview_options: {
        prefer_small_media: true,
        url: itemUrl,
      },
    },
  );
};

async function fetchItemDetails(nodeId: string): Promise<ItemDetails> {
  const node = await fetchNodeData(nodeId);

  if (!node) {
    return {
      title: "N/A",
      type: "Item",
      status: "N/A",
      projectTitle: "N/A",
    };
  }

  const status = extractStatus(node);
  const content = node.content;
  const repository = content?.repository;

  return {
    title: content?.title ?? "N/A",
    type: content?.__typename ?? "Item",
    url: content?.url,
    repositoryName: repository?.name,
    repositoryUrl: repository?.url,
    status,
    projectTitle: node.project?.title ?? "N/A",
  };
}

interface GraphQLResponse {
  node: {
    content: {
      title: string;
      url?: string;
      __typename: "DraftIssue" | "Issue" | "PullRequest";
      repository?: {
        name: string;
        url: string;
      };
    };
    project: {
      title: string;
    };
    fieldValues: {
      nodes: {
        name?: string;
        field?: {
          name: string;
        };
      }[];
    };
  };
}

async function fetchNodeData(nodeId: string): Promise<GraphQLResponse["node"] | null> {
  const result = await octokit.graphql<GraphQLResponse>(
    `
      query($id: ID!) {
        node(id: $id) {
          ... on ProjectV2Item {
            content {
              ... on Issue {
                title
                url
                __typename
                repository {
                  name
                  url
                }
              }
              ... on PullRequest {
                title
                url
                __typename
                repository {
                  name
                  url
                }
              }
              ... on DraftIssue {
                title
                __typename
              }
            }
            project {
              title
            }
            fieldValues(first: 50) {
              nodes {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field {
                    ... on ProjectV2SingleSelectField {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
      `,
    {
      id: nodeId,
    },
  );
  return result.node;
}

function extractStatus(node: GraphQLResponse["node"]): string {
  const statusNode = node.fieldValues.nodes.find((field) => field.field?.name === "Status");
  return statusNode?.name ?? "N/A";
}
