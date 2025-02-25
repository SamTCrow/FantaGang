import { z } from "zod";
const schema = z.object({
	legaId: z.coerce.number().positive().int().lte(9999999),
	giornataId: z.coerce.number().positive().int().lte(9999999),
	squadraCasa: z.coerce.number().positive().int().lte(9999999),
	puntiCasa: z.coerce.number().positive().int().lte(999),
	squadraOspite: z.coerce.number().positive().int().lte(9999999),
	puntiOspite: z.coerce.number().positive().int().lte(999),
});
