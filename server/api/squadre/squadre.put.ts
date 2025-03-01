import { z } from 'zod'
const schema = z.object({
  squadraId: z.coerce.number().int().positive().lte(999999),
  legaId: z.coerce.number().int().positive().lte(999999),
  nome: z.string().max(30).optional(),
  proprietario: z.string().max(30).optional(),
  stemma: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const { squadraId, legaId, proprietario, stemma, nome } = await readValidatedBody(event, schema.parse)
  if (!session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Utente non registrato' })
  }
  if (!session.user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Utente non autorizzato' })
  }
  try {
    const result = await db()
      .update(squadre)
      .set({ nome, stemma, legaId, presidente: proprietario })
      .where(and(eq(squadre.id, squadraId), eq(squadre.userId, session.user.id)))
      .returning()
      .get()
    if (!result) {
      throw createError({ statusCode: 500, message: 'Errore nel Database' })
    }
    return result
  } catch (error) {
    console.log(error)
    throw createError({ statusCode: 500, statusMessage: 'Errore imprevisto' })
  }
})
