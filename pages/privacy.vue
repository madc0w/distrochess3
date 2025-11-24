<template>
	<div class="privacy-page" v-cloak>
		<header class="privacy-topbar">
			<NuxtLink to="/" class="logo">{{ t.distroChess }}</NuxtLink>
			<nav class="top-links">
				<template v-if="isAuthenticated">
					<NuxtLink to="/game" class="ghost-link">{{
						t.privacy.backToGame
					}}</NuxtLink>
				</template>
				<template v-else>
					<NuxtLink to="/" class="ghost-link">{{
						t.privacy.backToLanding
					}}</NuxtLink>
					<NuxtLink to="/signup" class="btn primary">
						{{ t.signup }}
					</NuxtLink>
				</template>
			</nav>
		</header>

		<section class="privacy-hero">
			<p class="privacy-eyebrow">{{ t.privacy.linkLabel }}</p>
			<h1>{{ t.privacy.pageTitle }}</h1>
			<p class="last-updated">{{ t.privacy.lastUpdated }}</p>
		</section>

		<section class="privacy-content">
			<article
				v-for="section in privacySections"
				:key="section.title"
				class="privacy-section"
			>
				<h2 v-html="section.title"></h2>
				<p v-html="section.content"></p>
			</article>
		</section>

		<section class="privacy-footer">
			<p class="contact-line" v-html="t.privacy.contactPrompt"></p>
			<div class="footer-links">
				<NuxtLink v-if="isAuthenticated" to="/game" class="btn secondary">{{
					t.privacy.backToGame
				}}</NuxtLink>
				<NuxtLink v-else to="/" class="btn ghost">{{
					t.privacy.backToLanding
				}}</NuxtLink>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useI18n } from '~/composables/useI18n';

const { t } = useI18n();
const { isAuthenticated } = useAuth();
const privacySections = computed(() => t.value.privacy.sections ?? []);
</script>

<style scoped>
.privacy-page {
	max-width: 900px;
	margin: 0 auto;
	padding: 2rem 1.25rem 4rem;
	min-height: 100vh;
	animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.privacy-topbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	margin-bottom: 2rem;
}

.logo {
	font-size: 1.15rem;
	font-weight: 700;
	text-decoration: none;
	color: #111;
}

.top-links {
	display: flex;
	gap: 0.75rem;
	flex-wrap: wrap;
	justify-content: flex-end;
}

.ghost-link {
	text-decoration: none;
	color: #0f172a;
	font-weight: 500;
	padding: 0.5rem 0.85rem;
	border-radius: 999px;
	border: 1px solid rgba(15, 23, 42, 0.15);
	transition: background 0.2s ease;
}

.ghost-link:hover {
	background: rgba(15, 23, 42, 0.05);
}

.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.65rem 1.35rem;
	border-radius: 999px;
	font-weight: 600;
	text-decoration: none;
	border: 1px solid transparent;
	transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s;
}

.btn.primary {
	background: #74d66d;
	color: #000000;
	box-shadow: 0 10px 20px rgba(116, 214, 109, 0.25);
}

.btn.primary:hover {
	transform: translateY(-1px);
}

.btn.secondary {
	background: #fff;
	color: #74d66d;
	border-color: #74d66d;
}

.btn.ghost {
	background: rgba(15, 23, 42, 0.05);
	color: #0f172a;
}

.privacy-hero {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin-bottom: 2.5rem;
}

.privacy-eyebrow {
	text-transform: uppercase;
	letter-spacing: 0.3em;
	font-size: 0.7rem;
	color: #74d66d;
}

.privacy-hero h1 {
	margin: 0;
	font-size: clamp(2rem, 4vw, 3rem);
	color: #0f172a;
}

.last-updated {
	font-size: 0.9rem;
	color: #94a3b8;
}

.privacy-content {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.privacy-section {
	background: #fff;
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
	border: 1px solid #e2e8f0;
}

.privacy-section h2 {
	margin-top: 0;
	margin-bottom: 0.75rem;
	font-size: 1.35rem;
	color: #0f172a;
}

.privacy-section p {
	margin: 0;
	color: #475467;
	line-height: 1.7;
}

.privacy-footer {
	margin-top: 3rem;
	text-align: center;
	border-top: 1px solid #e2e8f0;
	padding-top: 2rem;
}

.contact-line {
	margin-bottom: 1.5rem;
	color: #475467;
}

.footer-links {
	display: flex;
	gap: 1rem;
	justify-content: center;
	flex-wrap: wrap;
}

@media (max-width: 600px) {
	.privacy-topbar {
		flex-direction: column;
		align-items: flex-start;
	}

	.top-links {
		justify-content: flex-start;
	}

	.btn,
	.ghost-link {
		width: 100%;
		justify-content: center;
	}
}
</style>
