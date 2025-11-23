<template>
	<div class="auth-page" v-cloak>
		<div class="gradient"></div>
		<div class="auth-shell">
			<div class="auth-card">
				<div class="auth-header">
					<p class="eyebrow">{{ t.distroChess }}</p>
					<h1>{{ t.authPage.resetPasswordTitle }}</h1>
					<p class="subtitle">{{ t.authPage.resetPasswordSubtitle }}</p>
				</div>

				<form v-if="!success" class="form" @submit.prevent="handleSubmit">
					<div class="form-group">
						<label for="new-password">{{ t.password }}</label>
						<input
							id="new-password"
							type="password"
							required
							autocomplete="new-password"
							v-model="password"
							:placeholder="t.enterNewPassword"
							minlength="6"
						/>
					</div>

					<div class="form-group">
						<label for="confirm-password">{{ t.confirmPassword }}</label>
						<input
							id="confirm-password"
							type="password"
							required
							autocomplete="new-password"
							v-model="confirmPassword"
							:placeholder="t.enterPasswordAgain"
							minlength="6"
						/>
					</div>

					<div v-if="tokenMissing" class="alert">
						{{ t.authPage.resetPasswordExpired }}
					</div>

					<button type="submit" class="primary" :disabled="isLoading">
						{{ isLoading ? t.pleaseWait : t.authPage.resetPasswordCta }}
					</button>
				</form>

				<div v-else class="success-copy">
					<h2>{{ t.authPage.resetPasswordSuccessTitle }}</h2>
					<p>{{ t.authPage.resetPasswordSuccessBody }}</p>
				</div>

				<p v-if="error" class="error">{{ error }}</p>

				<div class="back-home">
					<NuxtLink v-if="success" to="/signin" class="back-link">
						{{ t.authPage.backToSignin }}
					</NuxtLink>
					<NuxtLink v-else to="/forgot-password" class="back-link">
						{{ t.forgotPassword }}
					</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useEscapeKey } from '~/composables/useEscapeKey';
import { useI18n } from '~/composables/useI18n';

definePageMeta({
	ssr: false,
});

const router = useRouter();
const route = useRoute();
useEscapeKey(() => router.replace('/'));

const { resetPassword } = useAuth();
const { t } = useI18n();

const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const error = ref('');
const success = ref(false);

const token = computed(() => {
	const raw = route.query.token;
	if (Array.isArray(raw)) return raw[0] || '';
	return typeof raw === 'string' ? raw : '';
});

const tokenMissing = computed(() => !token.value);

watch([password, confirmPassword], () => {
	if (error.value) error.value = '';
});

async function handleSubmit() {
	if (tokenMissing.value) {
		error.value = t.value.authPage.resetPasswordExpired;
		return;
	}
	if (password.value !== confirmPassword.value) {
		error.value = t.value.passwordsMustMatch;
		return;
	}

	isLoading.value = true;
	error.value = '';

	try {
		const result = await resetPassword(token.value, password.value);
		if (!result.success) {
			error.value = result.error || t.value.errors.ERR_GENERIC;
			return;
		}
		success.value = true;
	} finally {
		isLoading.value = false;
	}
}
</script>

<style scoped>
.auth-page {
	position: relative;
	min-height: 100vh;
	background: #0b0d12;
	color: #fff;
	overflow: hidden;
}

.gradient {
	position: absolute;
	inset: 0;
	background: radial-gradient(
			circle at 85% 20%,
			rgba(72, 187, 120, 0.45),
			transparent 55%
		),
		radial-gradient(circle at 20% 0%, rgba(252, 211, 77, 0.35), transparent 55%),
		linear-gradient(
			135deg,
			rgba(13, 17, 23, 0.95) 0%,
			rgba(13, 17, 23, 0.8) 70%
		);
	filter: blur(0px);
	z-index: 0;
}

.auth-shell {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 3rem 1rem;
	min-height: 100vh;
	z-index: 1;
}

.auth-card {
	width: 100%;
	max-width: 420px;
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(6px);
	border-radius: 16px;
	padding: 2.5rem;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
	color: #0f1115;
}

.auth-header {
	text-align: left;
	margin-bottom: 1.5rem;
}

.eyebrow {
	text-transform: uppercase;
	font-size: 0.75rem;
	letter-spacing: 0.2em;
	color: #74d66d;
	margin-bottom: 0.5rem;
}

.subtitle {
	color: #5c6470;
	margin-top: 0.5rem;
	margin-bottom: 1rem;
	line-height: 1.5;
}

.form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
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
	border-color: #74d66d;
	box-shadow: 0 0 0 2px rgba(116, 214, 109, 0.15);
}

.alert {
	background: #fff7ed;
	border-radius: 10px;
	padding: 0.75rem 1rem;
	color: #c2410c;
	font-size: 0.95rem;
}

.primary {
	background: #2563eb;
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
	box-shadow: 0 12px 30px rgba(37, 99, 235, 0.25);
}

.success-copy {
	text-align: left;
	color: #1f2937;
}

.success-copy h2 {
	margin-bottom: 0.5rem;
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
