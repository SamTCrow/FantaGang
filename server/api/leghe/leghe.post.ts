import { schemaLegaInsert } from "~/shared/utils/legaPost";

export default defineEventHandler(async (event) => {
	const lega = await readValidatedBody(event, schemaLegaInsert.parse);
	const { user } = await getUserSession(event);
	if (!user?.id) {
		throw createError({ statusCode: 401, message: "Utente non autorizzato" });
	}
	try {
		const result = await db()
			.insert(leghe)
			.values({ ...lega, createdAt: new Date(), createdBy: user?.id })
			.returning()
			.get();

		if (!result) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}

		return result;
	} catch (error) {
		console.error(Error);
		throw createError({ statusCode: 500, message: "Errore imprevisto" });
	}
});
