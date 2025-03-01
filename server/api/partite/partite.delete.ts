import { z } from "zod";
const schema = z.object({
	id: z.coerce.number().positive().int().lte(9999999),
});

export default defineEventHandler(async (event) => {
	const query = await getValidatedQuery(event, schema.safeParse);
	const { user } = await getUserSession(event);

	if (!query.success) {
		throw createError({ statusCode: 400, message: "Parametri non validi" });
	}

	if (!user) {
		throw createError({ statusCode: 401, message: "Utente non autorizzato" });
	}

	try {
		const partita = await db()
			.select()
			.from(partite)
			.where(eq(partite.id, query.data.id))
			.get();

		if (!partita) {
			throw createError({ statusCode: 404, message: "Partita non trovata" });
		}

		if (!partita.legaId) {
			throw createError({ statusCode: 400, message: "ID lega non valido" });
		}

		const admin = await db()
			.select()
			.from(leghe)
			.where(and(eq(leghe.id, partita.legaId), eq(leghe.createdBy, user.id)))
			.get();

		if (!admin) {
			throw createError({ statusCode: 401, message: "Utente non autorizzato" });
		}

		const deletePartita = await db()
			.delete(partite)
			.where(eq(partite.id, query.data.id))
			.returning()
			.get();

		if (!deletePartita) {
			throw createError({ statusCode: 404, message: "Partita non trovata" });
		}

		return deletePartita;
	} catch (error) {
		console.error(error);
		throw createError({ status: 500, message: "Errore imprevisto" });
	}
});
