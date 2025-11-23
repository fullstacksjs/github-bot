import { createClient } from "@libsql/client/node";
import { config } from "#config";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema/index.ts";

/** Drizzle database instance */
export const db = drizzle({
  client: createClient({ url: config.database.filePath }),
  casing: "snake_case",
  schema,
});

/** Complete database schema */
export * as schema from "./schema/index.ts";
