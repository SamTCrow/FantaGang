import { z } from 'zod'

export const schemaSquadreInsert = z.object({
  nome: z.string().min(1, { message: 'Devi scriverci qualcosa!' }).max(40, 'Nome troppo lungo!'),
  proprietario: z.string().max(28, 'Nome troppo lungo!').optional(),
  stemma: z.string().optional(),
  legaId: z.coerce.number().int().gte(1).positive().lte(99999999)
})

export type SchemaSquadreInsert = z.output<typeof schemaSquadreInsert>;
