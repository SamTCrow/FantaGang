export default defineEventHandler(async (event) => {
	const legaId = 1;
	const listaSquadre = await db().select().from(tables.squadre).where(eq(tables.squadre.legaId, legaId));
	return listaSquadre;
});
