import { z } from "zod";
const schema = z.object({
	partitaId: z.number().positive().int().lte(9999999),
});
export default defineEventHandler(async (event) => {
	const session = await getUserSession(event);
	const partita = await readValidatedBody(event, schema.parse);
	if (!partita) {
		throw createError({ statusCode: 400, message: "Parametri errati" });
	}
	if (!session.user) {
		throw createError({ statusCode: 401, message: "Utente non loggato" });
	}
	const legaPartita = await db()
		.select({ legaId: partite.legaId })
		.from(partite)
		.where(eq(partite.id, partita.partitaId))
		.get();

	if (!legaPartita?.legaId) {
		throw createError({ statusCode: 500, message: "La lega non esiste più" });
	}

	const amministratore = await db()
		.select()
		.from(leghe)
		.where(and(eq(leghe.id, legaPartita.legaId), eq(leghe.createdBy, session.user.id)))
		.get();

	if (!amministratore) {
		throw createError({ statusCode: 401, message: "Utente non autorizzato" });
	}

	try {
		const cancellaRisultato = await db().delete(partite).where(eq(partite.id, partita.partitaId)).returning().get();
		if (!cancellaRisultato) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}
		return cancellaRisultato;
	} catch (error) {}
});
