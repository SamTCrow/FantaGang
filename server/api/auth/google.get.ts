import { users } from "~/server/utils/drizzle";
import { random } from "~/server/utils/dummypass";
import { H3Event, EventHandlerRequest } from "h3";

type GoogleUser = {
	sub: string;
	name: string;
	give_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
};

export default defineOAuthGoogleEventHandler({
	async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: GoogleUser }) {
		const checkUser = await db().select().from(users).where(eq(users.sub, user.sub)).get();
		if (!checkUser) {
			const newUser = await db()
				.insert(tables.users)
				.values({
					sub: user.sub,
					userName: user.name,
					email: user.email,
					password: await hashPassword(random(12)),
				})
				.returning({
					userName: users.userName,
					id: users.id,
				})
				.get();
			await setUserSession(event, {
				user: {
					username: newUser.userName,
					id: newUser.id,
				},
				loggedIn: new Date(),
			});
			return sendRedirect(event, "/");
		}
		await setUserSession(event, {
			user: {
				username: checkUser.userName,
				id: checkUser.id,
			},
			loggedIn: new Date(),
		});
		return sendRedirect(event, "/");
	},
	async onError(event: H3Event<EventHandlerRequest>, error: Error) {
		console.error("Google OAuth error:", error);
		return sendRedirect(event, "/error/error");
	},
});
