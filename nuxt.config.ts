// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-11-17',
	ssr: false,
	runtimeConfig: {
		mongodbUri: process.env.MONGODB_URI,
		mongodbDb: process.env.MONGODB_DB,
		jwtSecret: process.env.JWT_SECRET,
	},
	typescript: { strict: true },
	imports: {
		dirs: ['composables'],
	},
	nitro: {
		sourceMap: true,
		experimental: {
			openAPI: true,
		},
		devProxy: {},
	},
	vite: {
		server: {
			hmr: {
				protocol: 'ws',
				host: 'localhost',
			},
		},
		vue: {
			template: {
				compilerOptions: {
					isCustomElement: (tag: string) => ['emoji-picker'].includes(tag),
				},
			},
		},
	},
	hooks: {
		'nitro:init': (nitro) => {
			// Force Nitro dev server to run with inspect enabled
			if (process.env.NODE_ENV !== 'production') {
				nitro.options.dev = true;
			}
		},
	},
	sourcemap: {
		server: true,
		client: true,
	},
	app: {
		head: {
			link: [{ rel: 'icon', type: 'image/png', href: '/logo-small.jpg' }],
		},
	},
});
