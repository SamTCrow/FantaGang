import { schemaLegaInsert } from '~/shared/utils/legaPost'

export default defineEventHandler(async (event) => {
  const lega = await readValidatedBody(event, schemaLegaInsert.parse)
  const { user } = await getUserSession(event)
  if (user?.id) {
    try {
      const result = await db()
        .insert(leghe)
        .values({ ...lega, createdAt: new Date(), createdBy: user?.id })
        .returning()
        .get()
      return {
        success: true,
        data: result,
        message: 'Lega creata'
      }
    } catch (error) {
      return {
        success: false,
        data: error,
        message: 'Errore nella creazione della lega'
      }
    }
  }
  return {
    success: false,
    message: 'Non autorizzato'
  }
})
