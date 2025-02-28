import { z } from "zod";
const schema = z.object({
	partitaId: z.number().positive().int().lte(9999999),
	giornata: z.coerce.number().positive().int().lte(40).optional(),
	squadraCasa: z.number().positive().int().lte(9999999).optional(),
	puntiCasa: z.number().positive().int().lte(999).optional(),
	squadraOspite: z.number().positive().int().lte(9999999).optional(),
	puntiOspite: z.number().positive().int().lte(999).optional(),
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
		const partitaUpdate = await db()
			.update(partite)
			.set({
				numeroGiornata: partita.giornata,
				squadraCasa: partita.squadraCasa,
				squadraOspite: partita.squadraOspite,
				puntiSquadraCasa: partita.puntiCasa,
				puntiSquadraOspite: partita.puntiOspite,
			})
			.where(eq(partite.id, partita.partitaId))
			.returning()
			.get();

		if (!partitaUpdate) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}
		return partitaUpdate;
	} catch (error) {
		console.log(error);
		throw createError({ statusCode: 500, message: "Errore imprevisto" });
	}
});
