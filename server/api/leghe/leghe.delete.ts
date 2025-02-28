import { z } from "zod";
const schema = z.object({
	id: z.coerce.number().int().positive(),
	userId: z.coerce.number().int().positive(),
});

export default defineEventHandler(async (event) => {
	try {
		const { id, userId } = await readValidatedBody(event, schema.parse);
		const session = await getUserSession(event);

		if (!session.user || userId !== session.user.id) {
			return new Response(JSON.stringify({ success: false, message: "Non autorizzato" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		const result = await db()
			.delete(leghe)
			.where(and(eq(leghe.id, id), eq(leghe.createdBy, session.user.id)))
			.returning()
			.get();

		if (!result) {
			return new Response(JSON.stringify({ success: false, message: "Risorsa non trovata" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		return result;
	} catch (error) {
		console.error("Errore nell'endpoint DELETE:", error);
		return new Response(
			JSON.stringify({
				success: false,
				message: "Impossibile eliminare la lega",
				error: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
});
