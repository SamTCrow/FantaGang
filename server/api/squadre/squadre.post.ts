import { schemaSquadreInsert } from '~/shared/utils/squadraPost'

export default defineEventHandler(async (event) => {
  const { nome, proprietario, legaId, userId, stemma } = await readValidatedBody(event, schemaSquadreInsert.parse)
  const session = await getUserSession(event)
  if (session.user && session.user.id === userId) {
    try {
      const amministratore = await db()
        .select({ userId: leghe.createdBy })
        .from(leghe)
        .where(eq(leghe.id, legaId))
        .get()
      if (amministratore?.userId === userId) {
        const nuovaSquadra = await db()
          .insert(tables.squadre)
          .values({
            nome,
            presidente: proprietario,
            legaId,
            userId,
            createdAt: new Date(),
            stemma
          })
          .returning()
          .get()
        return {
          success: true,
          message: 'Squadra aggiunta!',
          data: nuovaSquadra
        }
      } else {
        return {
          success: false,
          message: 'Non sei amministratore di questa lega',
          data: ''
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Errore Sconosciuto',
        data: (error as Error).toString()
      }
    }
  }
  return {
    success: false,
    message: 'Utente non autorizzato',
    data: ''
  }
})
