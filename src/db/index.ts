import { createClient } from "@libsql/client/node";
import { drizzle } from "drizzle-orm/libsql";

import { config } from "../config";

export const db = drizzle({
  client: createClient({ url: config.database.filePath }),
  casing: "snake_case",
});
