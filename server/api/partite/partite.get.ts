export default defineEventHandler(async (event) => {
  // TODO endpoint per selezionare un'unica partita
  
  const listaPartite = await db().select().from(partite).groupBy(partite.legaId).limit(100)
  return listaPartite
})
