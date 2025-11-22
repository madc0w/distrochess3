<template>
	<div class="faq-page" v-cloak>
		<header class="faq-topbar">
			<NuxtLink to="/" class="logo">{{ t.distroChess }}</NuxtLink>
			<nav class="top-links">
				<template v-if="isAuthenticated">
					<NuxtLink to="/game" class="ghost-link">{{
						t.faq.backToGame
					}}</NuxtLink>
				</template>
				<template v-else>
					<NuxtLink to="/" class="ghost-link">{{
						t.faq.backToLanding
					}}</NuxtLink>
					<NuxtLink to="/signup" class="btn primary">
						{{ t.signup }}
					</NuxtLink>
				</template>
			</nav>
		</header>

		<section class="faq-hero">
			<p class="faq-eyebrow">{{ t.faq.linkLabel }}</p>
			<h1>{{ t.faq.pageTitle }}</h1>
			<p class="intro">{{ t.faq.intro }}</p>
			<p class="last-updated">{{ t.faq.lastUpdated }}</p>
		</section>

		<section class="faq-list">
			<article v-for="item in faqs" :key="item.question" class="faq-item">
				<h2>{{ item.question }}</h2>
				<p>{{ item.answer }}</p>
			</article>
		</section>

		<section class="faq-footer">
			<p class="contact-line" v-html="t.faq.contactPrompt"></p>
			<div class="footer-links">
				<NuxtLink v-if="isAuthenticated" to="/game" class="btn secondary">{{
					t.faq.backToGame
				}}</NuxtLink>
				<NuxtLink v-else to="/" class="btn ghost">{{
					t.faq.backToLanding
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
const faqs = computed(() => t.value.faq.items ?? []);
</script>

<style scoped>
.faq-page {
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

.faq-topbar {
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
	background: #4caf50;
	color: #fff;
	box-shadow: 0 10px 20px rgba(76, 175, 80, 0.25);
}

.btn.primary:hover {
	transform: translateY(-1px);
}

.btn.secondary {
	background: #fff;
	color: #4caf50;
	border-color: #4caf50;
}

.btn.ghost {
	background: rgba(15, 23, 42, 0.05);
	color: #0f172a;
}

.faq-hero {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin-bottom: 2.5rem;
}

.faq-eyebrow {
	text-transform: uppercase;
	letter-spacing: 0.3em;
	font-size: 0.7rem;
	color: #4caf50;
}

.faq-hero h1 {
	margin: 0;
	font-size: clamp(2rem, 4vw, 3rem);
	color: #0f172a;
}

.intro {
	font-size: 1.05rem;
	color: #475467;
	line-height: 1.7;
}

.last-updated {
	font-size: 0.9rem;
	color: #94a3b8;
}

.faq-list {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.faq-item {
	background: #fff;
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
	border: 1px solid #e2e8f0;
}

.faq-item h2 {
	margin-top: 0;
	margin-bottom: 0.5rem;
	font-size: 1.25rem;
	color: #0f172a;
}

.faq-item p {
	margin: 0;
	color: #475467;
	line-height: 1.6;
}

.faq-footer {
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
	.faq-topbar {
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
