import { schemaSquadreInsert } from "~/shared/utils/squadraPost";

export default defineEventHandler(async (event) => {
	const { nome, proprietario, legaId, stemma } = await readValidatedBody(
		event,
		schemaSquadreInsert.parse
	);
	const session = await getUserSession(event);
	if (!session.user) {
		throw createError({ statusCode: 401, message: "Utente non autorizzato." });
	}
	try {
		const amministratore = await db()
			.select()
			.from(leghe)
			.where(and(eq(leghe.id, legaId), eq(leghe.createdBy, session.user.id)))
			.get();

		if (!amministratore) {
			throw createError({ statusCode: 401, message: "Utente non autorizzato" });
		}

		const nuovaSquadra = await db()
			.insert(tables.squadre)
			.values({
				nome,
				presidente: proprietario,
				legaId,
				userId: session.user.id,
				createdAt: new Date(),
				stemma,
			})
			.returning()
			.get();

		if (!nuovaSquadra) {
			throw createError({
				statusCode: 500,
				message: "Errore nel database",
			});
		}

		return nuovaSquadra;
	} catch (error) {
		console.error(error);
		throw createError({
			statusCode: 500,
			message: "Errore imprevisto",
		});
	}
});
