import { z } from "zod";

import { Classifica } from "~/server/utils/classifica";
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
				id: leghe.id,
				giornateTotali: leghe.giornate,
				inizio: leghe.inizio,
				squadre: sql<string>`json_group_array(
      json_object(
        'nome', ${squadre.nome},
        'id', ${squadre.id},
				'presidente', ${squadre.presidente}
      )
    )`,
			})
			.from(leghe)
			.leftJoin(squadre, eq(squadre.legaId, leghe.id))
			.where(eq(leghe.id, legaId))
			.groupBy(leghe.id)
			.get();

		const classifica = await $fetch<Classifica>("/api/classifiche/" + legaId);

		if (!result) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}

		return {
			...result,
			squadre: JSON.parse(result.squadre),
			classifica: classifica,
		};
	} catch (error) {
		console.log(error);
		throw createError({ statusCode: 400, message: "Errore imprevisto" });
	}
});
