import { CommandGroup } from "@grammyjs/commands";

import type { BotContext } from "@/bot";

import { cmdListRepos } from "./listrepos";
import { cmdWhoami } from "./whoami";

export const commands = new CommandGroup<BotContext>().add([
  // cmdAddRepo,
  // cmdDiscover,
  // cmdLink,
  cmdListRepos,
  // cmdRemoveRepo,
  cmdWhoami,
]);
