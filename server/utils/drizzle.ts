import { drizzle } from "drizzle-orm/d1";
export { sql, eq, and, or } from "drizzle-orm";

import * as schema from "../database/schema";

export const tables = schema;

export function db() {
	return drizzle(hubDatabase(), { schema });
}

export type squadre = typeof schema.squadre.$inferInsert;
