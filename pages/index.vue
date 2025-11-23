<template>
	<div class="container" v-cloak>
		<div class="landing">
			<div class="topbar">
				<div class="logo">
					<img
						src="/logo-small.jpg"
						alt="DistroChess logo"
						class="logo-image"
					/>
					<span>{{ t.distroChess }}</span>
				</div>
				<div class="top-actions">
					<label class="language-switcher">
						<span class="visually-hidden">{{ t.landing.languageLabel }}</span>
						<select
							class="language-select"
							v-model="selectedLocale"
							:aria-label="t.landing.languageLabel"
						>
							<option
								v-for="option in languageOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</option>
						</select>
					</label>
					<div class="top-buttons">
						<NuxtLink to="/signin" class="btn ghost">{{ t.signin }}</NuxtLink>
						<NuxtLink to="/signup" class="btn primary">{{ t.signup }}</NuxtLink>
					</div>
				</div>
			</div>

			<div class="hero">
				<p class="hero-eyebrow">{{ t.landing.eyebrow }}</p>
				<h1 class="hero-title">{{ t.landing.headline }}</h1>
				<p class="hero-copy">{{ t.landing.description }}</p>
				<div class="hero-cta">
					<NuxtLink to="/signup" class="btn primary">{{ t.signup }}</NuxtLink>
					<NuxtLink to="/signin" class="btn secondary">{{ t.signin }}</NuxtLink>
				</div>
				<p class="cta-hint">{{ t.landing.ctaHint }}</p>
				<p class="faq-hint">
					{{ t.faq.ctaPrompt }}
					<NuxtLink to="/faq" class="faq-link">{{ t.faq.ctaLabel }}</NuxtLink>
				</p>
			</div>

			<div class="feature-grid">
				<div class="feature-card">
					<h3>{{ t.landing.featureTitle1 }}</h3>
					<p>{{ t.landing.featureCopy1 }}</p>
				</div>
				<div class="feature-card">
					<h3>{{ t.landing.featureTitle2 }}</h3>
					<p>{{ t.landing.featureCopy2 }}</p>
				</div>
				<div class="feature-card">
					<h3>{{ t.landing.featureTitle3 }}</h3>
					<p>{{ t.landing.featureCopy3 }}</p>
				</div>
			</div>

			<p class="community-tag">{{ t.landing.communityTag }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useI18n } from '~/composables/useI18n';
import { en } from '~/i18n';

const { t, locale, setLocale } = useI18n();
const { isAuthenticated } = useAuth();
const router = useRouter();
const route = useRoute();

type LocaleKey = keyof typeof en.languages;
const supportedLocales = Object.keys(en.languages) as LocaleKey[];

const languageOptions = computed(() =>
	supportedLocales.map((code) => ({
		value: code,
		label: t.value.languages?.[code] ?? en.languages[code] ?? code,
	}))
);

const selectedLocale = computed({
	get: () => locale.value,
	set: (nextLocale: string) => setLocale(nextLocale),
});

const requestedGameId = computed(() => {
	const raw = Array.isArray(route.query.gameId)
		? route.query.gameId[0]
		: route.query.gameId;
	return typeof raw === 'string' && raw.length ? raw : undefined;
});

if (process.client) {
	watchEffect(() => {
		const gameId = requestedGameId.value;
		if (isAuthenticated.value) {
			if (gameId) {
				router.replace({ path: '/game', query: { gameId } });
			} else {
				router.replace('/game');
			}
			return;
		}
		if (gameId) {
			const redirectTarget = `/game?gameId=${encodeURIComponent(gameId)}`;
			router.replace({
				path: '/signin',
				query: { redirect: redirectTarget },
			});
		}
	});
}
</script>

<style scoped>
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 1.25rem;
	min-height: 100vh;
	/* Prevent FOUC with initial hidden state and quick fade-in */
	animation: fadeInPage 0.15s ease-out;
}

@keyframes fadeInPage {
	from {
		opacity: 0;
		visibility: hidden;
	}
	to {
		opacity: 1;
		visibility: visible;
	}
}

.landing {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	padding: 2rem 0 3rem 0;
}

.topbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
}

.top-actions {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.logo {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1.25rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	color: #0f1115;
}

.logo-image {
	height: 36px;
	width: auto;
	display: block;
}

.top-buttons {
	display: flex;
	gap: 0.75rem;
}

.language-switcher {
	display: inline-flex;
	flex-direction: column;
	position: relative;
}

.language-select {
	appearance: none;
	background-color: #fff;
	border: 1px solid #cbd5e1;
	border-radius: 999px;
	padding: 0.5rem 2rem 0.5rem 0.75rem;
	font-weight: 600;
	color: #0f1115;
	min-width: 160px;
}

.language-switcher::after {
	content: '▾';
	position: absolute;
	right: 0.85rem;
	top: 50%;
	transform: translateY(-50%);
	color: #64748b;
	pointer-events: none;
}

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	border: 0;
}

.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem 1.5rem;
	border-radius: 999px;
	font-weight: 600;
	text-decoration: none;
	border: 1px solid transparent;
	transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s;
}

.btn.primary {
	background: #4caf50;
	color: #fff;
	box-shadow: 0 10px 25px rgba(76, 175, 80, 0.25);
}

.btn.primary:hover {
	transform: translateY(-1px);
}

.btn.secondary {
	background: #fff;
	border-color: #cbd5e1;
	color: #0f1115;
}

.btn.secondary:hover {
	background: #f8fafc;
}

.btn.ghost {
	background: rgba(15, 17, 21, 0.05);
	color: #0f1115;
}

.btn.ghost:hover {
	background: rgba(15, 17, 21, 0.1);
}

.hero {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	max-width: 720px;
}

.hero-eyebrow {
	text-transform: uppercase;
	letter-spacing: 0.25em;
	font-size: 0.75rem;
	color: #4caf50;
}

.hero-title {
	font-size: clamp(2.25rem, 4vw, 3.5rem);
	margin: 0;
	color: #0f1115;
}

.hero-copy {
	font-size: 1.15rem;
	line-height: 1.7;
	color: #475467;
}

.hero-cta {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
}

.cta-hint {
	color: #94a3b8;
	font-size: 0.95rem;
}

.faq-hint {
	color: #475467;
	font-size: 0.95rem;
}

.faq-link {
	color: #4caf50;
	text-decoration: none;
	font-weight: 600;
	margin-left: 0.5rem;
}

.faq-link:hover {
	text-decoration: underline;
}

.feature-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.25rem;
}

.feature-card {
	background: #ffffff;
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
	border: 1px solid #eef2ff;
}

.feature-card h3 {
	margin-top: 0;
	color: #111827;
}

.feature-card p {
	color: #475467;
	line-height: 1.6;
}

.community-tag {
	font-size: 0.95rem;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.3em;
}

/* Mobile optimizations */
@media (max-width: 600px) {
	.topbar,
	.hero-cta,
	.top-buttons,
	.top-actions {
		flex-direction: column;
		align-items: stretch;
		width: 100%;
	}

	.language-select {
		width: 100%;
	}

	.btn {
		width: 100%;
	}
}
</style>
