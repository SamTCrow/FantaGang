import { z } from "zod";
const schema = z.object({
	partitaId: z.number().positive().int().lte(9999999),
});

export default defineEventHandler(async (event) => {
	try {
		const session = await getUserSession(event);
		const partita = await readValidatedBody(event, schema.parse);

		if (!partita) {
			return new Response(JSON.stringify({ success: false, message: "Parametri errati" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		if (!session.user) {
			return new Response(JSON.stringify({ success: false, message: "Utente non loggato" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		const amministratore = await db()
			.select({ createdBy: leghe.createdBy })
			.from(partite)
			.leftJoin(leghe, eq(leghe.id, partite.id))
			.where(eq(partite.id, partita.partitaId))
			.get();

		if (amministratore?.createdBy !== session.user.id) {
			return new Response(JSON.stringify({ success: false, message: "Utente non autorizzato" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		const cancellaRisultato = await db().delete(partite).where(eq(partite.id, partita.partitaId)).returning().get();

		if (!cancellaRisultato) {
			return new Response(JSON.stringify({ success: false, message: "Partita non trovata" }), {
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
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
});
