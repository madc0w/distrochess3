import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
	ssr: true,
	runtimeConfig: {
		mongodbUri: process.env.MONGODB_URI || '',
		mongodbDb: process.env.MONGODB_DB || 'distrochess3',
	},
	typescript: { strict: true },
});
