
import { z } from "zod";
import { generaCalendario } from "~/server/utils/generaCalendario";

const schema = z.object({
	legaId: z.coerce.number().positive().int().max(999999999),
	ar: z.enum(["true", "false"]).optional(),
});

export default defineEventHandler(async (event) => {
	const params = await getValidatedQuery(event, schema.parse);
	const ar = params.ar === "true" ? true : false;

	const { user } = await getUserSession(event);
	if (!user) {
		throw createError({ statusCode: 401, message: "Utente non autenticato" });
	}

	const lega = await db()
		.select()
		.from(leghe)
		.leftJoin(partite, eq(partite.legaId, params.legaId))
		.where(and(eq(leghe.id, params.legaId), eq(leghe.createdBy, user.id)))
		.get();

	if (!lega) {
		throw createError({ statusCode: 403, statusMessage: "Non autorizzato." });
	}

	if (lega.partite) {
		throw createError({ statusCode: 403, statusMessage: "Lega iniziata." });
	}

	const squadreLega = await db()
		.select({ id: squadre.id, nome: squadre.nome })
		.from(squadre)
		.where(eq(squadre.legaId, params.legaId));

	if (squadreLega.length < 2) {
		throw createError({ statusCode: 400, statusMessage: "Servono almeno 2 squadre" });
	}
	try {
		const calendario = generaCalendario(squadreLega, ar, params.legaId);
		const ultimaGiornata = Math.max(...calendario.map((p) => p.numeroGiornata));
		const batchSize = 25; // 25 partite = 100 variabili, sotto il limite
		for (let i = 0; i < calendario.length; i += batchSize) {
			const batch = calendario.slice(i, i + batchSize);
			await db().insert(partite).values(batch);
		}
		await db()
			.update(leghe)
			.set({ giornate: ultimaGiornata })
			.where(eq(leghe.id, params.legaId));
		return calendario;
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, statusMessage: "Errore imprevisto" });
	}
});
