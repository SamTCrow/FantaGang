import { schemaLegaInsert } from "~/shared/utils/legaPost";

export default defineEventHandler(async (event) => {
	const lega = await readValidatedBody(event, schemaLegaInsert.parse);
	const { user } = await getUserSession(event);
	if (user?.id === lega.createdBy) {
		try {
			const result = await db()
				.insert(leghe)
				.values({ ...lega, createdAt: new Date() })
				.returning()
				.get();
			return {
				success: true,
				data: result,
				message: "Lega creata",
			};
		} catch (error) {
			return {
				success: false,
				data: error,
				message: "Errore nella creazione della lega",
			};
		}
	}
	return {
		success: false,
		message: "Non autorizzato",
	};
});
