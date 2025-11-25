import type { BotContext } from "#bot";

import { CommandGroup } from "@grammyjs/commands";

import { cmdHelp } from "./help.ts";
import { cmdListContributors } from "./listcontributors.ts";
import { cmdListRepos } from "./listrepos.ts";
import { cmdWhoami } from "./whoami.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userCommands = new CommandGroup<BotContext<any>>().add([
  cmdWhoami,
  cmdListContributors,
  cmdListRepos,
  cmdHelp,
]);
