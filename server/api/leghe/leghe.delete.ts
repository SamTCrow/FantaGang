import { z } from "zod";
const schema = z.object({
	id: z.coerce.number().int().positive(),
	userId: z.coerce.number().int().positive(),
});

export default defineEventHandler(async (event) => {
	const { id, userId } = await readValidatedBody(event, schema.parse);
	const session = await getUserSession(event);
	if (session.user && userId === session.user.id) {
		try {
			const result = await db()
				.delete(leghe)
				.where(and(eq(leghe.id, id), eq(leghe.createdBy, session.user.id)))
				.returning()
				.get();

			if (!result) {
				throw createError({ statusCode: 404, message: "Risorsa non trovata" });
			}
			return new Response(null, { status: 204 });
		} catch (error) {
			return {
				success: false,
				data: error,
				message: "Impossibile eliminare la lega",
			};
		}
	}
	return {
		success: false,
		message: "Non autorizzato",
	};
});
