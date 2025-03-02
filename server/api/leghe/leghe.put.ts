import { z } from "zod";

const schema = z.object({
	legaId: z.coerce.number().positive().int().lte(9999999),
	giornate: z.coerce.number().positive().int().lte(40).optional(),
	nome: z.string().min(1).max(30).optional(),
	inizio: z.coerce.date().optional(),
});

export default eventHandler(async (event) => {
	const { legaId, giornate, nome, inizio } = await readValidatedBody(event, schema.parse);
	const session = await getUserSession(event);
	if (!session.user) {
		throw createError({ statusCode: 404, statusMessage: "Utente non autorizzato" });
	}
  
	try {
		const legaUpdate = await db()
			.update(leghe)
			.set({ nome, giornate, inizio })
			.where(and(eq(leghe.id, legaId), eq(leghe.createdBy, session.user.id)))
			.returning()
			.get();
		if (!legaUpdate) {
			throw createError({ statusCode: 500, statusMessage: "Errore nel database" });
		}
		return { data: legaUpdate, success: true, message: "Lega modificata" };
	} catch (error) {
		console.log(error);
	}
});
