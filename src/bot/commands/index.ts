import { CommandGroup } from "@grammyjs/commands";

import type { BotContext } from "../bot";

import { cmdAddRepo } from "./addrepo";
import { cmdDiscover } from "./discover";
import { cmdHelp } from "./help";
import { cmdLink } from "./link";
import { cmdListContributors } from "./listcontributors";
import { cmdListRepos } from "./listrepos";
import { cmdRemoveRepo } from "./removerepo";
import { cmdUnLink } from "./unlink";
import { cmdWhoami } from "./whoami";

export const commands = new CommandGroup<BotContext>().add([
  cmdAddRepo,
  cmdDiscover,
  cmdLink,
  cmdUnLink,
  cmdListRepos,
  cmdRemoveRepo,
  cmdWhoami,
  cmdListContributors,
  cmdHelp,
]);
