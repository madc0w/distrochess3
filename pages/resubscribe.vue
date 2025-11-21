<template>
	<div class="resubscribe-page" v-cloak>
		<div class="card">
			<h1>{{ t.subscriptionPages.resubscribe.title }}</h1>
			<p v-if="status === 'pending'">
				{{ t.subscriptionPages.resubscribe.pending }}
			</p>
			<p v-else-if="status === 'success'">
				{{ t.subscriptionPages.resubscribe.success }}
			</p>
			<p v-else class="error">
				{{ errorMessage }}
			</p>

			<div class="links">
				<a :href="unsubscribeHref">
					{{ t.subscriptionPages.resubscribe.linkText }}
				</a>
				<a :href="appHref">{{ t.subscriptionPages.common.returnHome }}</a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from '~/composables/useI18n';

type ErrorKey = 'genericError' | 'missingUser' | 'updateFailed';

const route = useRoute();
const status = ref<'pending' | 'success' | 'error'>('pending');
const { t, setLocale } = useI18n();
const errorKey = ref<ErrorKey>('genericError');
const errorMessage = computed(() => {
	const common = t.value.subscriptionPages.common;
	return (common[errorKey.value] as string) ?? '';
});
const appHref = 'https://www.distrochess.com';

const userId = computed(() => {
	const raw = route.query.userId;
	if (Array.isArray(raw)) return raw[0] ?? '';
	return typeof raw === 'string' ? raw : '';
});

const unsubscribeHref = computed(() => {
	const id = userId.value;
	if (!id) return `${appHref}/unsubscribe`;
	return `${appHref}/unsubscribe?userId=${encodeURIComponent(id)}&unsub=true`;
});

async function markResubscribed() {
	if (!userId.value) {
		status.value = 'error';
		errorKey.value = 'missingUser';
		return;
	}

	try {
		const response = await fetch('/api/user/manageSub', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userId: userId.value, isSubscribe: true }),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(errorText || 'Request failed');
		}
		status.value = 'success';
	} catch (_error) {
		status.value = 'error';
		errorKey.value = 'updateFailed';
	}
}

async function syncPreferredLocale() {
	if (!userId.value) return;

	try {
		const response = await fetch(
			`/api/user/preferences?userId=${encodeURIComponent(userId.value)}`
		);
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(errorText || 'Failed to load locale');
		}
		const payload = (await response.json()) as {
			preferredLocale?: string;
		};
		if (
			payload.preferredLocale &&
			typeof payload.preferredLocale === 'string'
		) {
			setLocale(payload.preferredLocale);
		}
	} catch (error) {
		console.error('Unable to sync preferred locale', error);
	}
}

onMounted(() => {
	void syncPreferredLocale();
	void markResubscribed();
});
</script>

<style scoped>
.resubscribe-page {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #0f1115;
	color: #fff;
	padding: 24px;
}

.card {
	max-width: 420px;
	width: 100%;
	background: #1f2937;
	border-radius: 16px;
	padding: 32px;
	box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
	text-align: center;
}

.card h1 {
	margin-bottom: 16px;
	font-size: 1.5rem;
}

.links {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-top: 24px;
}

.links a {
	color: #60a5fa;
	text-decoration: none;
	font-weight: 600;
}

.links a:hover {
	text-decoration: underline;
}

.error {
	color: #f87171;
}
</style>
