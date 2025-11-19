// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-11-17',
	ssr: true,
	runtimeConfig: {
		mongodbUri: process.env.MONGODB_URI,
		mongodbDb: process.env.MONGODB_DB,
		jwtSecret: process.env.JWT_SECRET,
	},
	typescript: { strict: true },
	imports: {
		dirs: ['composables'],
	},
});
