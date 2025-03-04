import { z } from "zod";
import { userCheck } from "~/shared/utils/userPost";

const schema = z.object({
	userName: z
		.string()
		.min(3, { message: "Il nome deve essere di almeno 3 caratteri" })
		.max(20, { message: "Il nome non puo' essere piu' lungo di 20 caratteri" })
		.trim()
		.refine(
			async (data) => {
				const user = await userCheck(data);
				return user;
			},
			{ message: "Nome utente esistente" }
		)
		.optional(),
	vecchiaPassword: z
		.string({ message: "Richiesta" })
		.min(6, { message: "La password deve essere almeno di 6 caratteri" })
		.max(12, { message: "La password non deve superare i 12 caratteri" })
		.optional(),
	password: z
		.string({ message: "Richiesta" })
		.min(6, { message: "La password deve essere almeno di 6 caratteri" })
		.max(12, { message: "La password non deve superare i 12 caratteri" })
		.optional(),
	confirmPassword: z
		.string({ message: "Richiesta" })
		.min(6, { message: "La password deve essere almeno di 6 caratteri" })
		.max(12, { message: "La password non deve superare i 12 caratteri" })
		.optional(),
});
export default defineEventHandler(async (event) => {
	const params = await readValidatedBody(event, schema.parseAsync);
	const { user } = await getUserSession(event);

	if (!user) {
		throw createError({ statusCode: 401, message: "Utente non autorizzato" });
	}

	if (params.password && params.vecchiaPassword && params.confirmPassword) {
		if (params.password !== params.confirmPassword) {
			throw createError({
				statusCode: 400,
				message: "Le password non corrispondono",
			});
		}

		const userDb = await db()
			.select({ password: users.password })
			.from(users)
			.where(eq(users.id, user.id))
			.get();

		if (!userDb) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}

		const validPassword = await verifyPassword(userDb.password, params.vecchiaPassword);
		if (!validPassword) {
			throw createError({
				statusCode: 400,
				message: "Password attuale non corretta",
			});
		}
	}

	try {
		const response = await db()
			.update(users)
			.set({
				userName: params.userName,
				password: params.password ? await hashPassword(params.password) : undefined,
			})
			.where(and(eq(users.id, user.id)))
			.returning({ userId: users.id, userName: users.userName })
			.get();

		if (!response) {
			throw createError({ statusCode: 500, message: "Errore nel database" });
		}

		await setUserSession(event, {
			user: {
				username: response.userName,
				id: user.id,
			},
			loggedIn: new Date(),
		});

		return response;
	} catch (error) {
		console.error(error);
		throw createError({ statusCode: 500, message: "Errore imprevisto" });
	}
});
