import { aliasedTable } from "drizzle-orm";
import { z } from "zod";
const schema = z.object({
	legaId: z.coerce.number().positive().int().lte(99999999),
	giornata: z.coerce.number().positive().int().lte(40),
});

export default defineEventHandler(async (event) => {
	const params = await getValidatedRouterParams(event, schema.parse);
	try {
		const squadre2 = aliasedTable(squadre, "squadre2");
		const listaPartite = await db()
			.select({
				id: partite.id,
				squadraCasa: partite.squadraCasa,
				nomeCasa: squadre.nome,
				puntiCasa: partite.puntiSquadraCasa,
				squadraOspite: partite.squadraOspite,
				nomeOspite: squadre2.nome,
				puntiOspite: partite.puntiSquadraOspite,
			})
			.from(partite)
			.leftJoin(squadre, eq(partite.squadraCasa, squadre.id))
			.leftJoin(squadre2, eq(partite.squadraOspite, squadre2.id))
			.where(and(eq(partite.legaId, params.legaId), eq(partite.numeroGiornata, params.giornata)));
		
		return listaPartite;
	} catch (error) {
		console.log(error);
		throw createError({ statusCode: 500, message: "Errore interno" });
	}
});
