import { z } from 'zod'
export const schemaPartitaInsert = z
  .object({
    legaId: z.coerce.number().positive().int().lte(9999999),
    giornata: z.coerce.number().positive().int().lte(40).gt(0),
    squadraCasa: z.coerce.number().positive().int().lte(9999999),
    puntiCasa: z.coerce
      .number({ message: 'Deve essere un numero' })
      .positive({ message: 'Deve essere un numero positivo' })

      .lte(999, { message: 'Numero troppo grande!' }),
    squadraOspite: z.coerce.number().positive().int().lte(9999999),
    puntiOspite: z.coerce
      .number({ message: 'Deve essere un numero' })
      .positive({ message: 'Deve essere un numero positivo' })

      .lte(999, { message: 'Numero troppo grande!' })
  })
  .refine(data => data.squadraCasa !== data.squadraOspite, {
    message: 'Le due squadre non possono essere identiche',
    path: ['squadraCasa']
  })

export type SchemaPartitaInsert = z.output<typeof schemaPartitaInsert>;
