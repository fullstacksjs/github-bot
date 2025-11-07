import { CommandGroup } from "@grammyjs/commands";

import type { BotContext } from "../lib/bot";

import { cmdWhoami } from "./whoami";

export const commands = new CommandGroup<BotContext>().add([
  //   cmdDiscover, // cmd: discover
  //   cmdAddRepo, // cmd: addrepo <url>
  //   cmdRemoveRepo, // cmd: removerepo <url>
  //   cmdLink, // cmd: link <github_username>
  cmdWhoami, // cmd: whoami
  //   cmdListRepos, // cmd: listrepos
]);
