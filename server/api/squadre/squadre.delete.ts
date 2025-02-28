import { z } from "zod";
const schema = z.object({
	id: z.coerce.number().int().positive(),
	userId: z.coerce.number().int().positive(),
});

export default defineEventHandler(async (event) => {
	console.log("Inizio endpoint DELETE");
	try {
		console.log("Lettura body manuale");
		const rawBody = await readBody(event); // Usa readBody invece di readValidatedBody
		console.log("Raw body:", rawBody);
		const { id, userId } = schema.parse(rawBody);
		console.log("Body validato:", { id, userId });

		const session = await getUserSession(event);
		if (!session.user || userId !== session.user.id) {
			return new Response(JSON.stringify({ success: false, message: "Non autorizzato" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		const result = await db()
			.delete(squadre)
			.where(and(eq(squadre.id, id), eq(squadre.userId, session.user.id)))
			.returning()
			.get();

		if (!result) {
			return new Response(JSON.stringify({ success: false, message: "Risorsa non trovata" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error("Errore nell'endpoint DELETE:", error);
		return new Response(
			JSON.stringify({
				success: false,
				message: "Errore imprevisto",
				error: error instanceof Error ? error.message : String(error),
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
});
