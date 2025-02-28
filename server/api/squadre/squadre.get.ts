import { z } from 'zod'
const schema = z.object({
  userId: z.coerce.number().int().lte(9999999).optional(),
  legaId: z.coerce.number().int().lte(9999999).optional()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, schema.parse)
  try {
    const listaSquadre = await db()
      .select({
        id: squadre.id,
        nome: squadre.nome,
        legaId: leghe.id,
        lega: leghe.nome,
        presidente: squadre.presidente,
        userId: squadre.userId,
        stemma: squadre.stemma
      })
      .from(squadre)
      .leftJoin(users, eq(squadre.id, users.id))
      .leftJoin(leghe, eq(squadre.legaId, leghe.id))
      .where(or(eq(squadre.userId, query.userId ?? 0), eq(squadre.legaId, query.legaId ?? 0)))

    return listaSquadre
  } catch (error) {
    console.log(error)
    throw createError({ statusCode: 500, message: 'Errore imprevisto' })
  }
})
