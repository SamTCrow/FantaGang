import { isNotNull, max } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
	legaId: z.coerce.number().positive().int().lte(99999999),
});

export default defineEventHandler(async (event) => {
	const { legaId } = await getValidatedRouterParams(event, schema.parse);
	if (!legaId) {
		throw createError({ statusCode: 400, message: "Parametri non validi" });
	}

	try {
		const result = await db()
			.select({
				nome: leghe.nome,
				userId: leghe.createdBy,
				id: leghe.id,
				giornateTotali: leghe.giornate,
				inizio: leghe.inizio,
				squadre: sql<string>`json_group_array(
      json_object(
        'nome', ${squadre.nome},
        'id', ${squadre.id},
				'presidente', ${squadre.presidente},
				'stemma', ${squadre.stemma}
      )
    )`,
			})
			.from(leghe)
			.leftJoin(squadre, eq(squadre.legaId, leghe.id))
			.where(eq(leghe.id, legaId))
			.groupBy(leghe.id)
			.get();

		if (!result) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}

		const ultimaGiornata = await db()
			.select({ultimaGiornata: max(partite.numeroGiornata)})
			.from(partite)
			.where(
				and(
					eq(partite.legaId, legaId),
					isNotNull(partite.puntiSquadraCasa)
				)
			).get();

		return {
			...result,
			ultimaGiornata: ultimaGiornata?.ultimaGiornata ?? undefined,
			squadre: JSON.parse(result.squadre) as {
				nome: string;
				id: number;
				presidente: string;
				stemma: string;
			}[],
		};
	} catch (error) {
		console.log(error);
		throw createError({ statusCode: 400, message: "Errore imprevisto" });
	}
});
