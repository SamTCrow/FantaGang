export default defineEventHandler(async (event) => {
	const session = await getUserSession(event);

	if (!session.user) {
		throw createError({ statusCode: 401, message: "Utente non autorizzato" });
	}

	try {
		const listaSquadre = await db()
			.select({
				id: squadre.id,
				nome: squadre.nome,
				presidente: squadre.presidente,
				userId: squadre.userId,
				lega: leghe.nome,
				legaId: leghe.id,
				stemma: squadre.stemma,
				createdAt: squadre.createdAt,
			})
			.from(squadre)
			.leftJoin(leghe, eq(leghe.id, squadre.legaId))
			.where(eq(squadre.userId, session.user.id))
			.groupBy(squadre.id, squadre.legaId);

		if (!listaSquadre) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}

		return listaSquadre;
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, message: "Errore imprevisto" });
	}
});
