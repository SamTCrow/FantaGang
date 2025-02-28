import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userName: text('user_name').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar'),
  sub: text('sub')
})

export const leghe = sqliteTable('leghe', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('name').notNull(),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  giornate: integer('giornate').notNull().default(0),
  inizio: integer('inizio', { mode: 'timestamp' }),
  fine: integer('fine', { mode: 'timestamp' })
})

export const squadre = sqliteTable('squadre', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  presidente: text('presidente').notNull().default('Ignoto'),
  stemma: text('stemma'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  legaId: integer('lega_id').references(() => leghe.id, { onDelete: 'cascade' })
})

export const partite = sqliteTable(
  'partite',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    squadraCasa: integer('squadra_casa').references(() => squadre.id, { onDelete: 'set null' }),
    puntiSquadraCasa: integer('punti_squadra_casa').notNull().default(0),
    squadraOspite: integer('squadra_ospite').references(() => squadre.id, { onDelete: 'set null' }),
    puntiSquadraOspite: integer('punti_squadra_ospite').notNull().default(0),
    legaId: integer('lega_id').references(() => leghe.id, { onDelete: 'cascade' }),
    numeroGiornata: integer('numero_giornata').notNull()
  },
  table => ({
    unicaPartita: uniqueIndex('partita_unica_casa').on(table.legaId, table.numeroGiornata, table.squadraCasa),
    unicaPartitaOspite: uniqueIndex('partita_unica_ospite').on(
      table.legaId,
      table.numeroGiornata,
      table.squadraOspite
    )
  })
)

export const partecipantiLeghe = sqliteTable('partecipantiLeghe', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  legaId: integer('lega_id').references(() => leghe.id, { onDelete: 'cascade' }),
  squadraId: integer('squadra_id').references(() => squadre.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' })
})
