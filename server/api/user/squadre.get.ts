export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (session.user) {
    try {
      const listSquadre = await db()
        .select({
          id: squadre.id,
          nome: squadre.nome,
          presidente: squadre.presidente,
          userId: squadre.userId,
          lega: leghe.nome,
          legaId: leghe.id,
          stemma: squadre.stemma,
          createdAt: squadre.createdAt
        })
        .from(squadre)
        .leftJoin(leghe, eq(leghe.id, squadre.legaId))
        .where(eq(squadre.userId, session.user.id))
        .groupBy(squadre.id, squadre.legaId)
      return {
        success: true,
        message: 'Elenco squadre',
        data: listSquadre
      }
    } catch (error) {
      console.log(error)
      return {
        success: false,
        message: 'Errore nel caricamento delle squadre',
        data: null,
        error
      }
    }
  }
  return {
    success: false,
    message: 'Utente non autorizzato',
    data: null
  }
})
