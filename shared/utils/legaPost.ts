import { z } from "zod";

export const schemaLegaInsert = z.object({
	nome: z
		.string()
		.min(1, { message: "Devi inserire un nome" })
		.max(100, { message: "Il nome non può essere più lungo di 100 caratteri" })
		.trim(),
	createdBy: z.coerce.number().int().positive(),
	giornate: z.coerce.number().int().positive().lte(38, { message: "Massimo 38 giornate in una lega" }).default(0),
	inizio: z.coerce.date().optional(),
});

export type SchemaLegaInsert = z.output<typeof schemaLegaInsert>;
