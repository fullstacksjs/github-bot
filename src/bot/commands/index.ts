import { CommandGroup } from "@grammyjs/commands";

import type { BotContext } from "../bot.ts";

import { cmdAddRepo } from "./addrepo.ts";
import { cmdDiscover } from "./discover.ts";
import { cmdHelp } from "./help.ts";
import { cmdLink } from "./link.ts";
import { cmdListContributors } from "./listcontributors.ts";
import { cmdListRepos } from "./listrepos.ts";
import { cmdRemoveRepo } from "./removerepo.ts";
import { cmdUnlink } from "./unlink.ts";
import { cmdWhoami } from "./whoami.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const commands = new CommandGroup<BotContext<any>>().add([
  cmdAddRepo,
  cmdDiscover,
  cmdLink,
  cmdUnlink,
  cmdListRepos,
  cmdRemoveRepo,
  cmdWhoami,
  cmdListContributors,
  cmdHelp,
]);
