import { max } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	const session = await getUserSession(event);
	if (!session.user) {
		throw createError({ statusCode: 401, message: "Utento non autorizzato" });
	}
	try {
		const listaLeghe = await db()
			.select({
				id: leghe.id,
				nome: leghe.nome,
				createdBy: leghe.createdBy,
				createdAt: leghe.createdAt,
				createdByUsername: users.userName,
				inizio: leghe.inizio,
				giornateTotali: leghe.giornate,
				giornateGiocate: max(partite.numeroGiornata),
			})
			.from(leghe)
			.leftJoin(partite, eq(leghe.id, partite.legaId))
			.leftJoin(partecipantiLeghe, eq(leghe.id, partecipantiLeghe.legaId))
			.leftJoin(users, eq(users.id, leghe.createdBy))
			.where(
				or(
					eq(leghe.createdBy, session.user.id),
					eq(partecipantiLeghe.userId, session.user.id)
				)
			)
			.groupBy(leghe.id, users.userName);

		if (!listaLeghe) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}

		return listaLeghe;
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, message: "Errore imprevisto" });
	}
});
