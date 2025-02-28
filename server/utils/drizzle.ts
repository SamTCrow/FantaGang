import { drizzle } from 'drizzle-orm/d1'

import * as schema from '../database/schema'
export { sql, eq, and, or } from 'drizzle-orm'

export const tables = schema
export const users = schema.users
export const leghe = schema.leghe

export const partecipantiLeghe = schema.partecipantiLeghe
export const squadre = schema.squadre
export const partite = schema.partite

export function db () {
  return drizzle(hubDatabase(), { schema })
}

export type Squadre = typeof schema.squadre.$inferInsert;
export type Leghe = typeof schema.leghe.$inferInsert;
export type Utenti = typeof schema.users.$inferInsert;
export type Partite = typeof schema.partite.$inferInsert;
