import { serve } from "@hono/node-server";
import { bot } from "#bot";
import { config } from "#config";

import { createApi } from "./api.ts";

const api = await createApi();
await bot.start();
serve({ fetch: api.fetch, port: config.api.port });
// eslint-disable-next-line no-console
console.log(`API is listening on port ${config.api.port}`);
