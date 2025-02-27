import { aliasedTable } from "drizzle-orm";
import { z } from "zod";
const schemaParams = z.object({
	legaId: z.coerce.number().int().positive().lte(99999999),
});
const schemaQuery = z.object({
	from: z.coerce.number().positive().int().lte(40).optional(),
	to: z.coerce.number().positive().int().lte(40).optional(),
});

export default defineCachedEventHandler(
	async (event) => {
		const { legaId } = await getValidatedRouterParams(event, schemaParams.parse);
		const { from, to } = await getValidatedQuery(event, schemaQuery.parse);
		const squadraOspite = aliasedTable(squadre, "squadraOspite");

		const risultati = await db()
			.select({
				giornata: partite.numeroGiornata,
				risultati: sql<string>`json_group_array(json_object(
          'squadraCasa', ${squadre.nome},
          'puntiCasa', ${partite.puntiSquadraCasa},
          'squadraOspite', ${squadraOspite.nome},
          'puntiOspite', ${partite.puntiSquadraOspite}
        ))`,
			})
			.from(partite)
			.where(eq(partite.legaId, legaId))
			.leftJoin(squadre, eq(partite.squadraCasa, squadre.id))
			.leftJoin(squadraOspite, eq(partite.squadraOspite, squadraOspite.id))
			.groupBy(partite.numeroGiornata);

		return risultati.map((giornata) => ({
			...giornata,
			risultati: JSON.parse(giornata.risultati),
		}));
	},
	{
		maxAge: 0, //cache 1 ora
	}
);
