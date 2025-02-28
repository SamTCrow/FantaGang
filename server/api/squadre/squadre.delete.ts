import { z } from "zod";
const schema = z.object({
	id: z.coerce.number().int().positive(),
	userId: z.coerce.number().int().positive(),
});

export default defineEventHandler(async (event) => {
	console.log("Inizio endpoint DELETE");
	try {
		console.log("Lettura body nativa");
		const body = await new Promise<string>((resolve, reject) => {
			let data = '';
			event.node.req.on('data', chunk => data += chunk);
			event.node.req.on('end', () => resolve(data));
			event.node.req.on('error', reject);
		});
		console.log("Body grezzo:", body);
		const parsedBody = JSON.parse(body);
		const { id, userId } = schema.parse(parsedBody);
		console.log("Body validato:", { id, userId });

		console.log("Ottenimento sessione");
		const session = await getUserSession(event);
		console.log("Sessione:", session);

		if (!session.user || userId !== session.user.id) {
			console.log("Non autorizzato");
			return new Response(JSON.stringify({ success: false, message: "Non autorizzato" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		console.log("Esecuzione query DB");
		const result = await db()
			.delete(squadre)
			.where(and(eq(squadre.id, id), eq(squadre.userId, session.user.id)))
			.returning()
			.get();
		console.log("Risultato:", result);

		if (!result) {
			console.log("Risorsa non trovata");
			return new Response(JSON.stringify({ success: false, message: "Risorsa non trovata" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			});
		}

		console.log("Successo");
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
