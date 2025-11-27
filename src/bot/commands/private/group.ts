import type { BotContext } from "#bot";

import { CommandGroup } from "@grammyjs/commands";

import { cmdAddRepo } from "./addrepo.ts";
import { cmdDiscover } from "./discover.ts";
import { cmdLink } from "./link.ts";
import { cmdMute } from "./mute.ts";
import { cmdRemoveRepo } from "./removerepo.ts";
import { cmdUnlink } from "./unlink.ts";
import { cmdUnmute } from "./unmute.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adminCommands = new CommandGroup<BotContext<any>>().add([
  cmdAddRepo,
  cmdDiscover,
  cmdLink,
  cmdRemoveRepo,
  cmdUnlink,
  cmdMute,
  cmdUnmute,
]);
