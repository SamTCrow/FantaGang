import { count } from "drizzle-orm";
import { giornate } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
	const session = await getUserSession(event);
	try {
		if (session.user) {
			const listaLeghe = await db()
				.select({
					id: leghe.id,
					nome: leghe.nome,
					createdBy: leghe.createdBy,
					createdAt: leghe.createdAt,
					createdByUsername: users.userName,
					inizio: leghe.inizio,
					giornateTotali: leghe.giornate,
					giornateGiocate: count(giornate.id),
				})
				.from(leghe)
				.leftJoin(giornate, eq(leghe.id, giornate.legaId))
				.leftJoin(partecipantiLeghe, eq(leghe.id, partecipantiLeghe.legaId))
				.leftJoin(users, eq(users.id, leghe.createdBy))
				.where(or(eq(leghe.createdBy, session.user.id), eq(partecipantiLeghe.userId, session.user.id)))
				.groupBy(leghe.id, users.userName);

			return {
				success: true,
				message: "Le tue lege",
				data: listaLeghe,
			};
		}
	} catch (error) {
		return { success: false, message: "Errore inaspettato", error: error, data: null };
	}
	return {
		success: false,
		message: "Utente non autorizzato",
		data: null,
	};
});
