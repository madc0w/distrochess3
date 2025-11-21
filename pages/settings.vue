<template>
	<div class="settings-page" v-cloak>
		<div class="settings-card">
			<div class="card-header">
				<div>
					<h1>{{ t.settings.title }}</h1>
					<p>{{ t.settings.subtitle }}</p>
				</div>
				<NuxtLink to="/" class="back-link">{{
					t.settings.backToGames
				}}</NuxtLink>
			</div>

			<div v-if="error" class="alert alert-error">{{ error }}</div>
			<div v-if="success" class="alert alert-success">{{ success }}</div>

			<div v-if="isLoading" class="loading-state">
				<div class="spinner" aria-hidden="true"></div>
				<p>{{ t.pleaseWait }}</p>
			</div>

			<form v-else-if="user" class="settings-form" @submit.prevent="handleSave">
				<div class="form-grid">
					<div class="form-group">
						<label for="name">{{ t.name }}</label>
						<input id="name" type="text" required v-model="form.name" />
					</div>

					<div class="form-group">
						<label for="email">{{ t.email }}</label>
						<input id="email" type="email" required v-model="form.email" />
					</div>

					<div class="form-group">
						<label for="language">{{ t.settings.language }}</label>
						<select id="language" v-model="form.preferredLocale">
							<option
								v-for="option in languageOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</option>
						</select>
					</div>
				</div>

				<button type="submit" class="btn-primary" :disabled="!canSubmit">
					{{ isSaving ? t.pleaseWait : t.settings.save }}
				</button>
			</form>

			<div v-else class="empty-state">
				<p>{{ error || 'No profile data available.' }}</p>
			</div>

			<div v-if="user" class="readonly-grid">
				<div class="readonly-card">
					<span class="label">{{ t.settings.signupDate }}</span>
					<strong>{{ formattedCreatedDate }}</strong>
				</div>
				<div class="readonly-card">
					<span class="label">{{ t.score }}</span>
					<strong>{{ user.score }}</strong>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useAuth, type AuthPayload } from '~/composables/useAuth';
import { useI18n } from '~/composables/useI18n';
import { translateServerError } from '~/composables/useServerErrors';
import { en } from '~/i18n/en';
import type { PublicUser } from '~/server/types/user';
import { formatDate } from '~/utils/formatDate';

type PublicUserResponse = Omit<PublicUser, 'createdDate'> & {
	createdDate: string | null;
};

definePageMeta({
	ssr: false,
});

const router = useRouter();
const { t, setLocale, locale } = useI18n();
const { isAuthenticated, getAuthHeader } = useAuth();
const authState = useState<AuthPayload | null>('auth');

const user = ref<PublicUser | null>(null);
const isLoading = ref(false);
const isSaving = ref(false);
const error = ref('');
const success = ref('');
const form = reactive<Pick<PublicUser, 'name' | 'email' | 'preferredLocale'>>({
	name: '',
	email: '',
	preferredLocale: 'en',
});

function deserializeUser(user: PublicUserResponse): PublicUser {
	return {
		...user,
		createdDate: user.createdDate ? new Date(user.createdDate) : null,
	};
}

const languageOptions = computed(() => {
	const labels = t.value.languages as Record<string, string>;
	return Object.keys(en.languages).map((code) => ({
		value: code,
		label: labels[code] || en.languages[code as keyof typeof en.languages],
	}));
});

const formattedCreatedDate = computed(() => {
	return formatDate(
		user.value?.createdDate ?? null,
		user.value?.preferredLocale || locale.value || 'en'
	);
});

const canSubmit = computed(() => {
	if (!user.value) return false;
	const locale = form.preferredLocale || 'en';
	const originalLocale = user.value.preferredLocale || 'en';
	return (
		!isSaving.value &&
		(form.name !== user.value.name ||
			form.email !== user.value.email ||
			locale !== originalLocale)
	);
});

async function loadProfile() {
	if (!isAuthenticated.value) return;
	const headers = getAuthHeader();
	if (!headers) {
		await router.replace('/');
		return;
	}
	isLoading.value = true;
	error.value = '';
	try {
		const data = await $fetch<PublicUserResponse>('/api/user', {
			headers,
		});
		user.value = deserializeUser(data);
		form.name = user.value.name;
		form.email = user.value.email;
		form.preferredLocale = user.value.preferredLocale || 'en';
		setLocale(form.preferredLocale);
	} catch (err: any) {
		error.value =
			translateServerError(err, t.value) || 'Failed to load settings.';
		if (err?.statusCode === 401) {
			await router.replace('/');
		}
	} finally {
		isLoading.value = false;
	}
}

async function handleSave() {
	if (!user.value || !canSubmit.value) return;
	const headers = getAuthHeader();
	if (!headers) {
		await router.replace('/');
		return;
	}
	isSaving.value = true;
	error.value = '';
	success.value = '';
	try {
		const payload = await $fetch<PublicUserResponse>('/api/user', {
			method: 'PUT',
			headers,
			body: {
				name: form.name,
				email: form.email,
				preferredLocale: form.preferredLocale,
			},
		});
		user.value = deserializeUser(payload);
		form.name = user.value.name;
		form.email = user.value.email;
		form.preferredLocale = user.value.preferredLocale || 'en';
		setLocale(form.preferredLocale);
		success.value = t.value.settings.updateSuccess;
		if (authState.value) {
			authState.value = {
				...authState.value,
				user: {
					...authState.value.user,
					name: payload.name,
					email: payload.email,
					preferredLocale: payload.preferredLocale,
				},
			};
		}
	} catch (err: any) {
		error.value =
			translateServerError(err, t.value) || 'Failed to save settings.';
	} finally {
		isSaving.value = false;
	}
}

watch(
	() => isAuthenticated.value,
	async (authed) => {
		if (!authed) {
			user.value = null;
			success.value = '';
			if (process.client) {
				await router.replace('/');
			}
			return;
		}
		await loadProfile();
	},
	{ immediate: true }
);
</script>

<style scoped>
.settings-page {
	max-width: 720px;
	margin: 0 auto;
	padding: 2rem 1.5rem 4rem;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: flex-start;
}

.settings-card {
	width: 100%;
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
	padding: 2rem;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.card-header h1 {
	margin-bottom: 0.35rem;
	font-size: 1.75rem;
	color: #222;
}

.card-header p {
	color: #555;
	font-size: 0.95rem;
}

.back-link {
	align-self: center;
	text-decoration: none;
	color: #4caf50;
	font-weight: 600;
	border: 1px solid #4caf50;
	padding: 0.5rem 1rem;
	border-radius: 999px;
	transition: background 0.2s, color 0.2s;
}

.back-link:hover {
	background: #4caf50;
	color: #fff;
}

.alert {
	padding: 0.85rem 1rem;
	border-radius: 8px;
	margin-bottom: 1rem;
	font-size: 0.95rem;
}

.alert-error {
	background: #fdecea;
	color: #c63737;
	border: 1px solid #facdcd;
}

.alert-success {
	background: #edf7ed;
	color: #1e7a34;
	border: 1px solid #c7eecb;
}

.loading-state,
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 2rem 0;
	color: #555;
}

.spinner {
	width: 42px;
	height: 42px;
	border: 4px solid #e5e5e5;
	border-top-color: #4caf50;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.settings-form {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.form-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.25rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.4rem;
	font-weight: 600;
	color: #444;
}

.form-group input,
.form-group select {
	width: 100%;
	padding: 0.75rem;
	border: 1px solid #ddd;
	border-radius: 8px;
	font-size: 1rem;
	transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
	outline: none;
	border-color: #4caf50;
	box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
}

.btn-primary {
	align-self: flex-start;
	background: #4caf50;
	color: #fff;
	border: none;
	border-radius: 999px;
	padding: 0.75rem 1.75rem;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s;
}

.btn-primary:disabled {
	background: #cdd5ce;
	cursor: not-allowed;
}

.btn-primary:not(:disabled):hover {
	background: #43a047;
}

.readonly-grid {
	margin-top: 2rem;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
}

.readonly-card {
	background: #f7f9f8;
	border-radius: 12px;
	padding: 1rem 1.25rem;
	border: 1px solid #e1e5e3;
}

.readonly-card .label {
	display: block;
	font-size: 0.85rem;
	text-transform: uppercase;
	color: #7c8a81;
	margin-bottom: 0.35rem;
	letter-spacing: 0.04em;
}

.readonly-card strong {
	font-size: 1.1rem;
	color: #2a2f2c;
}

@media (max-width: 600px) {
	.settings-card {
		padding: 1.5rem;
	}

	.card-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.back-link {
		align-self: flex-start;
	}
}
</style>
