import { z } from "zod";
const schema = z.object({
	confirm: z.literal("TRUE"),
});

export default defineEventHandler(async (event) => {
	const query = await getValidatedQuery(event, schema.parse);
	if (!query) {
		throw createError({ statusCode: 400, message: "Parametri non validi" });
	}

	const { user } = await getUserSession(event);
	if (!user) {
		throw createError({ statusCode: 401, message: "Utente non autorizzato" });
	}

	try {
		const deletedUser = await db().delete(users).where(eq(users.id, user.id)).returning().get();
		if (!deletedUser) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}
		return deletedUser;
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, message: "Errore imprevisto" });
	}
});
