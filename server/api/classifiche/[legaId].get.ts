import { aliasedTable, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { calcoloClassifica, Giornata } from "~/server/utils/classifica";

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
          'idCasa', ${squadre.id},
          'puntiCasa', ${partite.puntiSquadraCasa},
          'squadraOspite', ${squadraOspite.nome},
          'idOspite', ${squadraOspite.id},
          'puntiOspite', ${partite.puntiSquadraOspite}
        ))`,
			})
			.from(partite)
			.where(
				and(
					eq(partite.legaId, legaId),
					gte(partite.numeroGiornata, from ?? 1),
					lte(partite.numeroGiornata, to ?? 40)
				)
			)
			.leftJoin(squadre, eq(partite.squadraCasa, squadre.id))
			.leftJoin(squadraOspite, eq(partite.squadraOspite, squadraOspite.id))
			.groupBy(partite.numeroGiornata);

		const dati = risultati.map((giornata) => ({
			numero: giornata.giornata,
			risultati: JSON.parse(giornata.risultati),
		})) satisfies Giornata[];

		const classifica = await calcoloClassifica(dati);
		return classifica;
	},
	{
		maxAge: 60 * 10, // cache 10 minuti,
	}
);
