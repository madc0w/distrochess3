<template>
	<div class="auth-shell">
		<div class="auth-card">
			<div class="auth-header">
				<p class="eyebrow">{{ t.distroChess }}</p>
				<h1>{{ heading }}</h1>
				<p class="subtitle">{{ subtitle }}</p>
				<div class="auth-switch">
					<span>{{ switchCopy }}</span>
					<NuxtLink :to="switchTo" class="switch-link">
						{{ switchLabel }}
					</NuxtLink>
				</div>
			</div>

			<form class="form" @submit.prevent="handleSubmit">
				<div v-if="mode === 'signup'" class="form-group">
					<label for="name">{{ t.name }}</label>
					<input
						id="name"
						type="text"
						required
						autocomplete="name"
						v-model.trim="name"
						:placeholder="t.enterName"
					/>
				</div>

				<div class="form-group">
					<label for="email">{{ t.email }}</label>
					<input
						id="email"
						type="email"
						required
						autocomplete="email"
						v-model.trim="email"
						:placeholder="t.enterEmail"
					/>
				</div>

				<div class="form-group">
					<label for="password">{{ t.password }}</label>
					<input
						id="password"
						type="password"
						required
						:autocomplete="
							mode === 'signup' ? 'new-password' : 'current-password'
						"
						v-model="password"
						:placeholder="t.enterPassword"
						:minlength="6"
					/>
				</div>

				<div v-if="mode === 'signin'" class="form-row">
					<NuxtLink class="forgot-link" to="/forgot-password">
						{{ t.forgotPassword }}
					</NuxtLink>
				</div>

				<button type="submit" class="primary" :disabled="isLoading">
					{{ isLoading ? t.pleaseWait : primaryLabel }}
				</button>
			</form>

			<p v-if="error" class="error">{{ error }}</p>

			<div class="back-home">
				<NuxtLink to="/" class="back-link">
					{{ t.authPage.backHome }}
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useI18n } from '~/composables/useI18n';
import { translateServerError } from '~/composables/useServerErrors';

const props = defineProps<{ mode: 'signin' | 'signup'; redirectTo?: string }>();

const { t } = useI18n();
const { signin, signup } = useAuth();

const name = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

const heading = computed(() =>
	props.mode === 'signin'
		? t.value.authPage.signinTitle
		: t.value.authPage.signupTitle
);
const subtitle = computed(() =>
	props.mode === 'signin'
		? t.value.authPage.signinSubtitle
		: t.value.authPage.signupSubtitle
);
const switchCopy = computed(() =>
	props.mode === 'signin' ? t.value.noAccount : t.value.haveAccount
);
const switchLabel = computed(() =>
	props.mode === 'signin' ? t.value.signup : t.value.signin
);
const switchTo = computed<RouteLocationRaw>(() => {
	const basePath = props.mode === 'signin' ? '/signup' : '/signin';
	if (props.redirectTo) {
		return { path: basePath, query: { redirect: props.redirectTo } };
	}
	return basePath;
});
const primaryLabel = computed(() =>
	props.mode === 'signin' ? t.value.signin : t.value.signup
);

watch([name, email, password], () => {
	if (error.value) error.value = '';
});

async function handleSubmit() {
	error.value = '';
	isLoading.value = true;

	try {
		const result =
			props.mode === 'signin'
				? await signin(email.value, password.value)
				: await signup(name.value, email.value, password.value);

		if (!result.success) {
			error.value = result.error || t.value.errors.ERR_GENERIC;
			return;
		}
	} catch (err: any) {
		error.value =
			translateServerError(err, t.value) || t.value.errors.ERR_GENERIC;
	} finally {
		isLoading.value = false;
	}
}
</script>

<style scoped>
.auth-shell {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 3rem 1rem;
	min-height: 100vh;
}

.auth-card {
	width: 100%;
	max-width: 420px;
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(6px);
	border-radius: 16px;
	padding: 2.5rem;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.auth-header {
	text-align: left;
	margin-bottom: 1.5rem;
}

.auth-header h1 {
	margin: 0;
	color: #0f1115;
}

.eyebrow {
	text-transform: uppercase;
	font-size: 0.75rem;
	letter-spacing: 0.2em;
	color: #4caf50;
	margin-bottom: 0.5rem;
}

.subtitle {
	color: #5c6470;
	margin-top: 0.5rem;
	margin-bottom: 1rem;
	line-height: 1.5;
}

.auth-switch {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.9rem;
	color: #5c6470;
}

.switch-link {
	color: #4caf50;
	font-weight: 600;
	text-decoration: none;
}

.switch-link:hover {
	text-decoration: underline;
}

.form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.form-row {
	display: flex;
	justify-content: flex-end;
}

.forgot-link {
	font-size: 0.9rem;
	color: #4caf50;
	text-decoration: none;
	font-weight: 500;
}

.forgot-link:hover {
	text-decoration: underline;
}

.form-group label {
	display: block;
	margin-bottom: 0.4rem;
	font-weight: 600;
	color: #242b36;
}

.form-group input {
	width: 100%;
	padding: 0.85rem;
	border-radius: 10px;
	border: 1px solid #d4d8de;
	font-size: 1rem;
}

.form-group input:focus {
	outline: none;
	border-color: #4caf50;
	box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.15);
}

.primary {
	background: #4caf50;
	color: #fff;
	border: none;
	padding: 0.9rem;
	border-radius: 10px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.primary:hover:not(:disabled) {
	transform: translateY(-1px);
	box-shadow: 0 12px 30px rgba(76, 175, 80, 0.25);
}

.error {
	margin-top: 1rem;
	color: #d93025;
	font-weight: 500;
	background: #fdecea;
	padding: 0.75rem 1rem;
	border-radius: 8px;
}

.back-home {
	margin-top: 1.25rem;
	text-align: center;
}

.back-link {
	color: #5c6470;
	text-decoration: none;
	font-size: 0.9rem;
}

.back-link:hover {
	text-decoration: underline;
}

@media (max-width: 600px) {
	.auth-card {
		padding: 1.75rem;
	}
}
</style>
