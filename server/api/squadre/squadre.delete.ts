import { z } from "zod";
const schema = z.object({
	id: z.coerce.number().int().positive(),
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
		const deletedTeam = await db()
			.delete(squadre)
			.where(and(eq(squadre.id, query.data.id), eq(squadre.userId, user.id)))
			.returning()
			.get();

		if (!deletedTeam) {
			throw createError({ statusCode: 404, message: "Squadra non esistente" });
		}

		return deletedTeam;
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, message: "Errore imprevisto" });
	}
});
