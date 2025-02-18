// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		"@nuxt/ui",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/color-mode",
		"@nuxt/icon",
		"nuxt-auth-utils",

		"@nuxthub/core",
	],
	colorMode: {
		preference: "light",
	},
	compatibilityDate: "2025-02-18",
});
