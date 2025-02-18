import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const leghe = sqliteTable("leghe", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	nome: text("name").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const squadre = sqliteTable("squadre", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	nome: text("nome").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	proprietario: text("propretario").notNull().default("Ignoto"),
	legaId: integer("lega_id").references(() => leghe.id, { onDelete: "cascade" }),
});

export const giornate = sqliteTable("giornate", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	numero: integer("id").notNull(),
	legaId: integer("lega_id").references(() => leghe.id, { onDelete: "cascade" }),
});

export const partite = sqliteTable("partite", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	squadraCasa: integer("squadra_casa").references(() => squadre.id, { onDelete: "cascade" }),
	puntiSquadraCasa: integer("punti_squadra_casa").notNull().default(0),
	squadraOspite: integer("squadra_ospite").references(() => squadre.id, { onDelete: "cascade" }),
	puntiSquadraOspite: integer("punti_squadra_ospite").notNull().default(0),
	legaId: integer("lega_id").references(() => leghe.id, { onDelete: "cascade" }),
});
