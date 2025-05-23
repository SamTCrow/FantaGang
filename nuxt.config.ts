// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		"@nuxt/ui",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/color-mode",
		"@nuxt/icon",
		"nuxt-auth-utils",
		"@formkit/auto-animate/nuxt",
		"@nuxthub/core",
	],

	hub: {
		database: true,
	},
	colorMode: {
		preference: "light",
	},
	compatibilityDate: "2025-02-18",
	css: ["/assets/css/tailwind.css"],
	runtimeConfig: {
		oauth: {
			google: {
				clientId: "",
				clientSecret: "",
			},
		},
	},
});
