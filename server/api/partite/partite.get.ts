export default defineEventHandler(async (event) => {
	const listaPartite = await db().select().from(partite).groupBy(partite.legaId).limit(100);
	return listaPartite;
});
