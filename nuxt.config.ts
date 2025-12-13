// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-11-17',
	ssr: false,
	modules: ['@vite-pwa/nuxt'],
	pwa: {
		registerType: 'autoUpdate',
		manifest: {
			name: 'Distrochess',
			short_name: 'Distrochess',
			description: 'Play chess with the world - one move at a time',
			theme_color: '#1a1a2e',
			background_color: '#1a1a2e',
			display: 'standalone',
			orientation: 'portrait',
			scope: '/',
			start_url: '/',
			icons: [
				{
					src: '/pwa-192x192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/pwa-512x512.png',
					sizes: '512x512',
					type: 'image/png',
				},
				{
					src: '/pwa-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'maskable',
				},
			],
		},
		workbox: {
			navigateFallback: '/',
			globPatterns: ['**/*.{js,css,html,ico}'],
			globIgnores: ['**/logo-large-old.png'],
			maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
		},
		devOptions: {
			enabled: true,
			type: 'module',
		},
	},
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
			link: [
				{ rel: 'icon', type: 'image/png', href: '/logo-small.jpg' },
				{ rel: 'manifest', href: '/manifest.webmanifest' },
				{ rel: 'apple-touch-icon', href: '/pwa-192x192.png' },
			],
			meta: [
				{ name: 'theme-color', content: '#1a1a2e' },
				{ name: 'apple-mobile-web-app-capable', content: 'yes' },
				{
					name: 'apple-mobile-web-app-status-bar-style',
					content: 'black-translucent',
				},
			],
		},
	},
});
