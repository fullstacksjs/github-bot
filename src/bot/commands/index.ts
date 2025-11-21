import { CommandGroup } from "@grammyjs/commands";

import type { BotContext } from "../context";

import { cmdAddRepo } from "./addrepo";
import { cmdDiscover } from "./discover";
import { cmdLink } from "./link";
import { cmdListRepos } from "./listrepos";
import { cmdRemoveRepo } from "./removerepo";
import { cmdWhoami } from "./whoami";

export const commands = new CommandGroup<BotContext>().add([
  cmdAddRepo,
  cmdDiscover,
  cmdLink,
  cmdListRepos,
  cmdRemoveRepo,
  cmdWhoami,
]);
