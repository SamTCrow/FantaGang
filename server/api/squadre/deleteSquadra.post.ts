import { z } from "zod";

export default defineEventHandler(async (event) => {
	const { squadraId } = await readValidatedBody(
		event,
		z.object({ squadraId: z.coerce.number().positive().int() }).parse
	);
	try {
		const squadraCancellata = await db()
			.delete(tables.squadre)
			.where(eq(tables.squadre.id, squadraId))
			.returning()
			.get();
		return {
			success: true,
			data: squadraCancellata,
		};
	} catch (error) {
		return {
			success: false,
			error: (error as Error).toString(),
		};
	}
});
