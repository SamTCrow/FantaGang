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
		const deleteLega = await db()
			.delete(leghe)
			.where(and(eq(leghe.id, query.data.id), eq(leghe.createdBy, user.id)))
			.returning()
			.get();

		if (!deleteLega) {
			throw createError({ statusCode: 404, message: "Lega non esistente" });
		}

		return deleteLega;
	} catch (error) {
		console.error(error);
		throw createError({ status: 500, message: "Errore imprevisto" });
	}
});
