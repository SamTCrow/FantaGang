declare module "#auth-utils" {
	interface UserSession {
		user: {
			username: string;
			id: number;
		};
		loggedIn: Date;
	}
	interface User {
		username: string;
		id: number;
	}
}

export {};
