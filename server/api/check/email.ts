import { z } from "zod";

export default defineEventHandler(async (event) => {
	const { email } = await getValidatedQuery(
		event,
		z.object({
			email: z.string().trim(),
		}).parse
	);
	const result = await db().select().from(tables.users).where(eq(tables.users.email, email)).get();
	if (!result) {
		return false;
	} else {
		return true;
	}
});
