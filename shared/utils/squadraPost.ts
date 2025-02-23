import { z } from "zod";

export const schemaSquadreInsert = z.object({
	nome: z.string().min(1, { message: "Devi scriverci qualcosa!" }).max(28, "Nome troppo lungo!"),
	proprietario: z.string().or(z.undefined()),
	legaId: z.coerce.number().int().gte(1).lte(99999),
});

export type SchemaSquadreInsert = z.output<typeof schemaSquadreInsert>;
