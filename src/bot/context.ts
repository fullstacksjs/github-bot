import type { I18nFlavor } from "@grammyjs/i18n";
import type { Context } from "grammy";

import type { MarkdownContext } from "./middleware/markdown";

export type BotContext = Context & I18nFlavor & MarkdownContext;
