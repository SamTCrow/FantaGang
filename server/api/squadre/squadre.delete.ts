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
				.delete(squadre)
				.where(and(eq(squadre.id, id), eq(squadre.userId, session.user.id)))
				.returning()
				.get();
			return new Response(null, { status: 204 });
		} catch (error) {
			return {
				success: false,
				data: error,
				message: "Impossibile eliminare la squadra",
			};
		}
	}
	return {
		success: false,
		message: "Non autorizzato",
	};
});
