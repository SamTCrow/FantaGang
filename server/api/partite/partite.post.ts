import { schemaPartitaInsert } from "~/shared/utils/partitaPost";

export default defineEventHandler(async (event) => {
	const session = await getUserSession(event);
	const partita = await readValidatedBody(event, schemaPartitaInsert.parse);

	if (!partita) {
		throw createError({ statusCode: 400, message: "Parametri errati" });
	}
	if (!session.user) {
		throw createError({ statusCode: 401, message: "Utente non loggato" });
	}

	const amministratore = await db()
		.select()
		.from(leghe)
		.where(and(eq(leghe.id, partita.legaId), eq(leghe.createdBy, session.user.id)))
		.get();

	if (!amministratore) {
		throw createError({ statusCode: 401, message: "Utente non autorizzato" });
	}

	try {
		const result = await db()
			.insert(partite)
			.values({
				numeroGiornata: partita.giornata,
				legaId: partita.legaId,
				squadraCasa: partita.squadraCasa,
				puntiSquadraCasa: partita.puntiCasa,
				squadraOspite: partita.squadraOspite,
				puntiSquadraOspite: partita.puntiOspite,
			})
			.returning()
			.get();
		if (!result) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}
		return result;
	} catch (error) {
		console.log(error);
		throw createError({ statusCode: 500, message: "Errore imprevisto" });
	}
});
