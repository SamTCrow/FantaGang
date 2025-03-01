import { z } from 'zod'

export const schemaLegaInsert = z.object({
  nome: z
    .string()
    .min(1, { message: 'Devi inserire un nome' })
    .max(100, { message: 'Il nome non può essere più lungo di 100 caratteri' })
    .trim(),
  giornate: z.coerce
    .number()
    .int({ message: 'Solo numeri interi' })
    .gte(0, { message: 'Deve essere maggiore di 0' })
    .lte(40, { message: 'Massimo 38 giornate in una lega' })
    .default(0),
  inizio: z.coerce.date({ message: 'Data non valida' }).optional()
})

export type SchemaLegaInsert = z.output<typeof schemaLegaInsert>;
