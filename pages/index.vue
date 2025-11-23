<template>
	<div class="container" v-cloak>
		<div class="animated-bg">
			<div class="gradient-orb orb-1"></div>
			<div class="gradient-orb orb-2"></div>
			<div class="gradient-orb orb-3"></div>
		</div>

		<div class="chess-pieces-bg">
			<div class="chess-piece piece-1">♔</div>
			<div class="chess-piece piece-2">♟</div>
			<div class="chess-piece piece-3">♞</div>
			<div class="chess-piece piece-4">♜</div>
			<div class="chess-piece piece-5">♛</div>
			<div class="chess-piece piece-6">♝</div>
		</div>

		<div class="landing">
			<div class="topbar">
				<div class="logo">
					<img
						src="/logo-small.jpg"
						alt="DistroChess logo"
						class="logo-image"
					/>
					<span>{{ t.distroChess }}</span>
					<NuxtLink to="/faq" class="btn-faq">
						{{ t.faq.linkLabel }}
					</NuxtLink>
					<div class="language-dropdown">
						<button
							class="btn-lang"
							@click="toggleLanguageMenu"
							:aria-label="t.landing.languageLabel"
							ref="langButton"
						>
							{{ locale.toUpperCase() }}
						</button>
						<Teleport to="body">
							<div
								v-if="showLanguageMenu"
								class="language-menu"
								:style="menuPosition"
							>
								<button
									v-for="option in languageOptions"
									:key="option.value"
									class="language-option"
									:class="{ active: locale === option.value }"
									@click="selectLanguage(option.value)"
								>
									{{ option.label }}
								</button>
							</div>
						</Teleport>
					</div>
				</div>
				<div class="top-actions">
					<div class="top-buttons">
						<NuxtLink to="/signin" class="btn ghost">{{ t.signin }}</NuxtLink>
						<NuxtLink to="/signup" class="btn primary glow">{{
							t.signup
						}}</NuxtLink>
					</div>
				</div>
			</div>

			<div class="hero">
				<p class="hero-eyebrow animate-in">{{ t.landing.eyebrow }}</p>
				<h1 class="hero-title animate-in delay-1">{{ t.landing.headline }}</h1>
				<p class="hero-copy animate-in delay-2">{{ t.landing.description }}</p>
				<div class="hero-cta animate-in delay-3">
					<NuxtLink to="/signup" class="btn primary glow pulse">{{
						t.signup
					}}</NuxtLink>
					<NuxtLink to="/signin" class="btn secondary glass">{{
						t.signin
					}}</NuxtLink>
				</div>
				<p class="cta-hint animate-in delay-4">{{ t.landing.ctaHint }}</p>
				<p class="faq-hint animate-in delay-4">
					{{ t.faq.ctaPrompt }}
					<NuxtLink to="/faq" class="faq-link">{{ t.faq.ctaLabel }}</NuxtLink>
				</p>
			</div>

			<div class="feature-grid">
				<div class="feature-card glass-card animate-in delay-5">
					<div class="feature-icon">🌍</div>
					<h3>{{ t.landing.featureTitle1 }}</h3>
					<p>{{ t.landing.featureCopy1 }}</p>
				</div>
				<div class="feature-card glass-card animate-in delay-6">
					<div class="feature-icon">⚡</div>
					<h3>{{ t.landing.featureTitle2 }}</h3>
					<p>{{ t.landing.featureCopy2 }}</p>
				</div>
				<div class="feature-card glass-card animate-in delay-7">
					<div class="feature-icon">💬</div>
					<h3>{{ t.landing.featureTitle3 }}</h3>
					<p>{{ t.landing.featureCopy3 }}</p>
				</div>
			</div>

			<p class="community-tag animate-in delay-8">
				{{ t.landing.communityTag }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	computed,
	nextTick,
	onMounted,
	onUnmounted,
	ref,
	watchEffect,
} from 'vue';
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

const showLanguageMenu = ref(false);
const langButton = ref<HTMLElement | null>(null);
const menuPosition = ref({});

const toggleLanguageMenu = () => {
	showLanguageMenu.value = !showLanguageMenu.value;

	if (showLanguageMenu.value && langButton.value) {
		nextTick(() => {
			const rect = langButton.value!.getBoundingClientRect();
			menuPosition.value = {
				position: 'fixed',
				top: `${rect.bottom + 8}px`,
				right: `${window.innerWidth - rect.right}px`,
				zIndex: 999999,
			};
		});
	}
};

const selectLanguage = (lang: string) => {
	setLocale(lang);
	showLanguageMenu.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	if (!target.closest('.language-dropdown')) {
		showLanguageMenu.value = false;
	}
};

const requestedGameId = computed(() => {
	const raw = Array.isArray(route.query.gameId)
		? route.query.gameId[0]
		: route.query.gameId;
	return typeof raw === 'string' && raw.length ? raw : undefined;
});

if (process.client) {
	onMounted(() => {
		document.addEventListener('click', handleClickOutside);
	});

	onUnmounted(() => {
		document.removeEventListener('click', handleClickOutside);
	});

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
	position: relative;
	overflow: visible;
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

/* Animated gradient background */
.animated-bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -2;
	background: #1a4d2e;
}

.gradient-orb {
	display: none;
}

.orb-1 {
	display: none;
}

.orb-2 {
	display: none;
}

.orb-3 {
	display: none;
	right: 20%;
	animation-delay: -14s;
}

@keyframes float {
	0%,
	100% {
		transform: translate(0, 0) rotate(0deg);
	}
	33% {
		transform: translate(30px, -30px) rotate(120deg);
	}
	66% {
		transform: translate(-20px, 20px) rotate(240deg);
	}
}

/* Chess pieces floating background */
.chess-pieces-bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	pointer-events: none;
	overflow: hidden;
}

.chess-piece {
	position: absolute;
	font-size: 120px;
	color: rgba(255, 255, 255, 0.08);
	animation: floatPiece 25s ease-in-out infinite;
	text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
}

.piece-1 {
	top: 10%;
	left: 5%;
	animation-delay: 0s;
}
.piece-2 {
	top: 70%;
	left: 85%;
	animation-delay: -5s;
	font-size: 80px;
}
.piece-3 {
	top: 30%;
	right: 10%;
	animation-delay: -10s;
}
.piece-4 {
	bottom: 15%;
	left: 15%;
	animation-delay: -15s;
	font-size: 100px;
}
.piece-5 {
	top: 50%;
	left: 50%;
	animation-delay: -20s;
	font-size: 150px;
}
.piece-6 {
	top: 80%;
	right: 40%;
	animation-delay: -8s;
	font-size: 90px;
}

@keyframes floatPiece {
	0%,
	100% {
		transform: translate(0, 0) rotate(0deg);
		opacity: 0.08;
	}
	25% {
		transform: translate(20px, -40px) rotate(5deg);
		opacity: 0.12;
	}
	50% {
		transform: translate(-15px, -20px) rotate(-3deg);
		opacity: 0.06;
	}
	75% {
		transform: translate(25px, 30px) rotate(4deg);
		opacity: 0.1;
	}
}

.landing {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	padding: 2rem 0 3rem 0;
	position: relative;
	z-index: 1;
}

.topbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	animation: slideDown 0.6s ease-out;
	position: relative;
	z-index: 10000;
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
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
	color: #ffffff;
	text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
	transition: transform 0.3s ease;
}

.logo:hover {
	transform: scale(1.05);
}

.logo-image {
	height: 36px;
	width: auto;
	display: block;
	border-radius: 8px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-faq {
	padding: 0.45rem 0.9rem;
	border: 1px solid rgba(255, 255, 255, 0.3);
	color: #ffffff;
	border-radius: 999px;
	font-size: 0.85rem;
	text-decoration: none;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	transition: background 0.2s ease;
	margin-left: 0.75rem;
}

.btn-faq:hover {
	background: rgba(255, 255, 255, 0.25);
}

.language-dropdown {
	position: relative;
	margin-left: 0.5rem;
	z-index: 100000;
}

.btn-lang {
	padding: 0.45rem 0.75rem;
	border: 1px solid rgba(255, 255, 255, 0.3);
	color: #ffffff;
	border-radius: 999px;
	font-size: 0.75rem;
	font-weight: 600;
	text-decoration: none;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	transition: all 0.2s ease;
	cursor: pointer;
	white-space: nowrap;
	display: flex;
	align-items: center;
	gap: 0.35rem;
}

.btn-lang::before {
	content: '';
	width: 18px;
	height: 18px;
	display: inline-block;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E");
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}

.btn-lang:hover {
	background: rgba(255, 255, 255, 0.25);
	transform: scale(1.05);
}

.language-menu {
	background: rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(20px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	overflow: hidden;
	min-width: 140px;
	animation: slideDownMenu 0.2s ease-out;
	pointer-events: auto;
}

@keyframes slideDownMenu {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.language-option {
	width: 100%;
	padding: 0.75rem 1rem;
	border: none;
	background: transparent;
	color: #0f1115;
	font-size: 0.875rem;
	font-weight: 500;
	text-align: left;
	cursor: pointer;
	transition: background 0.2s ease;
}

.language-option:hover {
	background: rgba(116, 214, 109, 0.15);
}

.language-option.active {
	background: rgba(116, 214, 109, 0.25);
	font-weight: 600;
}

.top-buttons {
	display: flex;
	gap: 0.75rem;
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
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.btn::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 0;
	height: 0;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.3);
	transform: translate(-50%, -50%);
	transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
	width: 300px;
	height: 300px;
}

.btn.primary {
	background: linear-gradient(135deg, #74d66d 0%, #5ec854 100%);
	color: #fff;
	box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
	position: relative;
}

.btn.primary.glow {
	animation: buttonGlow 2s ease-in-out infinite;
}

@keyframes buttonGlow {
	0%,
	100% {
		box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4),
			0 0 20px rgba(76, 175, 80, 0.3);
	}
	50% {
		box-shadow: 0 10px 40px rgba(76, 175, 80, 0.6),
			0 0 30px rgba(76, 175, 80, 0.5);
	}
}

.btn.primary.pulse {
	animation: buttonGlow 2s ease-in-out infinite, pulse 2s ease-in-out infinite;
}

@keyframes pulse {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
}

.btn.primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 15px 40px rgba(76, 175, 80, 0.5);
}

.btn.secondary {
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	border-color: rgba(255, 255, 255, 0.3);
	color: #0f1115;
}

.btn.secondary.glass {
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	color: #ffffff;
}

.btn.secondary:hover,
.btn.secondary.glass:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: translateY(-2px);
	box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
}

.btn.ghost {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	color: #ffffff;
	border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn.ghost:hover {
	background: rgba(255, 255, 255, 0.25);
	transform: translateY(-1px);
}

.hero {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	max-width: 720px;
	margin-top: 3rem;
}

/* Staggered animation for hero elements */
.animate-in {
	animation: slideInUp 0.8s ease-out forwards;
	opacity: 0;
}

.delay-1 {
	animation-delay: 0.1s;
}
.delay-2 {
	animation-delay: 0.2s;
}
.delay-3 {
	animation-delay: 0.3s;
}
.delay-4 {
	animation-delay: 0.4s;
}
.delay-5 {
	animation-delay: 0.5s;
}
.delay-6 {
	animation-delay: 0.6s;
}
.delay-7 {
	animation-delay: 0.7s;
}
.delay-8 {
	animation-delay: 0.8s;
}

@keyframes slideInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.hero-eyebrow {
	text-transform: uppercase;
	letter-spacing: 0.25em;
	font-size: 0.75rem;
	color: #ffffff;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	padding: 0.5rem 1rem;
	border-radius: 999px;
	display: inline-block;
	width: fit-content;
	border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-title {
	font-size: clamp(2.25rem, 4vw, 3.5rem);
	margin: 0;
	color: #ffffff;
	text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.hero-copy {
	font-size: 1.15rem;
	line-height: 1.7;
	color: rgba(255, 255, 255, 0.95);
	text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-cta {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
	margin-top: 1rem;
}

.cta-hint {
	color: rgba(255, 255, 255, 0.8);
	font-size: 0.95rem;
	text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.faq-hint {
	color: rgba(255, 255, 255, 0.9);
	font-size: 0.95rem;
	text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.faq-link {
	color: #ffffff;
	text-decoration: none;
	font-weight: 600;
	margin-left: 0.5rem;
	padding: 0.25rem 0.75rem;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 999px;
	transition: all 0.3s ease;
}

.faq-link:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: translateX(5px);
}

.feature-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.5rem;
	margin-top: 2rem;
}

.feature-card {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 20px;
	padding: 2rem 1.5rem;
	box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
	border: 1px solid rgba(255, 255, 255, 0.5);
	transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	position: relative;
}

.feature-card.glass-card {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(20px);
	border: 1px solid rgba(255, 255, 255, 0.3);
}

.feature-card:hover {
	transform: translateY(-10px) scale(1.02);
	box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
}

.feature-icon {
	font-size: 3rem;
	margin-bottom: 1rem;
	display: inline-block;
	animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}

.feature-card:hover .feature-icon {
	animation: iconSpin 0.6s ease-in-out;
}

@keyframes iconSpin {
	0% {
		transform: rotate(0deg) scale(1);
	}
	50% {
		transform: rotate(180deg) scale(1.2);
	}
	100% {
		transform: rotate(360deg) scale(1);
	}
}

.feature-card h3 {
	margin-top: 0;
	color: #ffffff;
	text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.feature-card p {
	color: rgba(255, 255, 255, 0.95);
	line-height: 1.6;
	text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.community-tag {
	font-size: 0.95rem;
	color: rgba(255, 255, 255, 0.7);
	text-transform: uppercase;
	letter-spacing: 0.3em;
	text-align: center;
	margin-top: 2rem;
	text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Mobile optimizations */
@media (max-width: 600px) {
	.topbar {
		flex-direction: column;
		align-items: stretch;
		width: 100%;
	}

	.logo {
		flex-wrap: wrap;
		justify-content: center;
	}

	.hero-cta,
	.top-buttons,
	.top-actions {
		flex-direction: column;
		align-items: stretch;
		width: 100%;
	}

	.btn {
		width: 100%;
	}

	.chess-piece {
		font-size: 60px;
	}

	.hero {
		margin-top: 1.5rem;
	}

	.feature-grid {
		grid-template-columns: 1fr;
	}
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}
</style>
