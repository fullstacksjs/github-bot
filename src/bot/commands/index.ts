import { CommandGroup } from "@grammyjs/commands";

import type { BotContext } from "../bot.ts";

import { cmdAddRepo } from "./addrepo.ts";
import { cmdDiscover } from "./discover.ts";
import { cmdHelp } from "./help.ts";
import { cmdLink } from "./link.ts";
import { cmdListContributors } from "./listcontributors.ts";
import { cmdListRepos } from "./listrepos.ts";
import { cmdRemoveRepo } from "./removerepo.ts";
import { cmdUnLink } from "./unlink.ts";
import { cmdWhoami } from "./whoami.ts";

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
