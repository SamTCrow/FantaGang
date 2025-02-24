import { z } from "zod";
const schema = z.object({
	legaId: z.coerce.number().positive().int().lte(999999),
});
export default defineEventHandler(async (event) => {});
