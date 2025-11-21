<template>
	<div class="container" v-cloak>
		<div class="landing">
			<div class="topbar">
				<div class="logo">{{ t.distroChess }}</div>
				<div class="top-buttons">
					<NuxtLink to="/signin" class="btn ghost">{{ t.signin }}</NuxtLink>
					<NuxtLink to="/signup" class="btn primary">{{ t.signup }}</NuxtLink>
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
			</div>

			<div class="feature-grid">
				<div class="feature-card">
					<h3>{{ t.landing.featureTitleOne }}</h3>
					<p>{{ t.landing.featureCopyOne }}</p>
				</div>
				<div class="feature-card">
					<h3>{{ t.landing.featureTitleTwo }}</h3>
					<p>{{ t.landing.featureCopyTwo }}</p>
				</div>
				<div class="feature-card">
					<h3>{{ t.landing.featureTitleThree }}</h3>
					<p>{{ t.landing.featureCopyThree }}</p>
				</div>
			</div>

			<p class="community-tag">{{ t.landing.communityTag }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useI18n } from '~/composables/useI18n';

const { t } = useI18n();
const { isAuthenticated } = useAuth();
const router = useRouter();

if (process.client) {
	watchEffect(() => {
		if (isAuthenticated.value) {
			router.replace('/game');
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

.logo {
	font-size: 1.25rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	color: #0f1115;
}

.top-buttons {
	display: flex;
	gap: 0.75rem;
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
	.top-buttons {
		flex-direction: column;
		align-items: stretch;
		width: 100%;
	}

	.btn {
		width: 100%;
	}
}
</style>
