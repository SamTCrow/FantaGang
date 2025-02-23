import { schemaSquadreInsert } from "~/shared/utils/squadraPost";

export default defineEventHandler(async (event) => {
	const { nome, proprietario, legaId } = await readValidatedBody(event, schemaSquadreInsert.parse);

	try {
		const nuovaSquadra = await db()
			.insert(tables.squadre)
			.values({
				nome: nome,
				proprietario: proprietario,
				legaId: legaId,
				createdAt: new Date(),
			})
			.returning()
			.get();
		return {
			success: true,
			nuovaSquadra,
		};
	} catch (error) {
		return {
			success: false,
			error: (error as Error).toString(),
		};
	}
});
