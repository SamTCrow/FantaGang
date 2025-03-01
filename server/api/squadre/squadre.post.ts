import { schemaSquadreInsert } from "~/shared/utils/squadraPost";

export default defineEventHandler(async (event) => {
	const { nome, proprietario, legaId, stemma } = await readValidatedBody(
		event,
		schemaSquadreInsert.parse
	);
	const session = await getUserSession(event);
	if (session.user?.id) {
		try {
			const amministratore = await db()
				.select({ userId: leghe.createdBy })
				.from(leghe)
				.where(eq(leghe.id, legaId))
				.get();
			if (amministratore?.userId === session.user.id) {
				const nuovaSquadra = await db()
					.insert(tables.squadre)
					.values({
						nome,
						presidente: proprietario,
						legaId,
						userId: session.user.id,
						createdAt: new Date(),
						stemma,
					})
					.returning()
					.get();
				return {
					success: true,
					message: "Squadra aggiunta!",
					data: nuovaSquadra,
				};
			} else {
				return {
					success: false,
					message: "Non sei amministratore di questa lega",
					data: "",
				};
			}
		} catch (error) {
			return {
				success: false,
				message: "Errore Sconosciuto",
				data: (error as Error).toString(),
			};
		}
	}
	return {
		success: false,
		message: "Utente non autorizzato",
		data: "",
	};
});
