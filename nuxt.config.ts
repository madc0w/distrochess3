// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
	ssr: true,
	runtimeConfig: {
		mongodbUri: process.env.MONGODB_URI,
		mongodbDb: process.env.MONGODB_DB,
	},
	typescript: { strict: true },
};
