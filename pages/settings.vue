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

					<div class="form-group form-group-full">
						<button
							type="button"
							class="btn-change-password"
							@click="openPasswordModal"
						>
							{{ t.settings.changePassword }}
						</button>
					</div>

					<div class="form-group">
						<label for="language" class="language-label">{{
							t.settings.language
						}}</label>
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

					<div class="form-group form-group-full">
						<label>{{ t.settings.duckQuestion }}</label>
						<div class="radio-group">
							<label class="radio-label">
								<input
									type="radio"
									name="duckOpinion"
									value="favor"
									v-model="form.duckOpinion"
								/>
								<span>{{ t.settings.duckFavor }}</span>
							</label>
							<label class="radio-label">
								<input
									type="radio"
									name="duckOpinion"
									value="opposed"
									v-model="form.duckOpinion"
								/>
								<span>{{ t.settings.duckOpposed }}</span>
							</label>
						</div>
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

		<!-- Change Password Modal -->
		<Teleport to="body">
			<div
				v-if="isShowPasswordModal"
				class="modal-overlay"
				@click="closePasswordModal"
			>
				<div class="modal-content" @click.stop>
					<div class="modal-header">
						<h2>{{ t.settings.changePasswordTitle }}</h2>
						<button
							class="close-btn"
							@click="closePasswordModal"
							aria-label="Close"
						>
							×
						</button>
					</div>
					<form @submit.prevent="handlePasswordChange" class="password-form">
						<div class="form-group">
							<label for="currentPassword">{{
								t.settings.currentPassword
							}}</label>
							<input
								id="currentPassword"
								type="password"
								required
								v-model="passwordForm.currentPassword"
								:class="{ 'input-error': isPasswordError }"
							/>
							<span v-if="isPasswordError" class="error-message">{{
								t.settings.incorrectPassword
							}}</span>
						</div>
						<div class="form-group">
							<label for="newPassword">{{ t.settings.newPassword }}</label>
							<input
								id="newPassword"
								type="password"
								required
								minlength="6"
								v-model="passwordForm.newPassword"
							/>
						</div>
						<div class="modal-actions">
							<button
								type="button"
								class="btn-secondary"
								@click="closePasswordModal"
							>
								{{ t.settings.cancel }}
							</button>
							<button
								type="submit"
								class="btn-primary"
								:disabled="isChangingPassword"
							>
								{{
									isChangingPassword ? t.pleaseWait : t.settings.setNewPassword
								}}
							</button>
						</div>
					</form>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useAuth, type AuthPayload } from '~/composables/useAuth';
import { useEscapeKey } from '~/composables/useEscapeKey';
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
const form = reactive<
	Pick<PublicUser, 'name' | 'email' | 'preferredLocale' | 'duckOpinion'>
>({
	name: '',
	email: '',
	preferredLocale: 'en',
	duckOpinion: undefined,
});

const isShowPasswordModal = ref(false);
const isChangingPassword = ref(false);
const isPasswordError = ref(false);
const passwordForm = reactive({
	currentPassword: '',
	newPassword: '',
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
			locale !== originalLocale ||
			form.duckOpinion !== user.value.duckOpinion)
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
		form.duckOpinion = user.value.duckOpinion;
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
				duckOpinion: form.duckOpinion,
			},
		});
		user.value = deserializeUser(payload);
		form.name = user.value.name;
		form.email = user.value.email;
		form.preferredLocale = user.value.preferredLocale || 'en';
		form.duckOpinion = user.value.duckOpinion;
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

function openPasswordModal() {
	isShowPasswordModal.value = true;
	isPasswordError.value = false;
	passwordForm.currentPassword = '';
	passwordForm.newPassword = '';
}

function closePasswordModal() {
	isShowPasswordModal.value = false;
	isPasswordError.value = false;
	passwordForm.currentPassword = '';
	passwordForm.newPassword = '';
}

async function handlePasswordChange() {
	if (!isAuthenticated.value) return;
	const headers = getAuthHeader();
	if (!headers) {
		await router.replace('/');
		return;
	}

	isChangingPassword.value = true;
	isPasswordError.value = false;
	error.value = '';
	success.value = '';

	try {
		await $fetch('/api/user/change-password', {
			method: 'POST',
			headers,
			body: {
				currentPassword: passwordForm.currentPassword,
				newPassword: passwordForm.newPassword,
			},
		});

		success.value = t.value.settings.passwordChanged;
		closePasswordModal();
	} catch (err: any) {
		if (
			err?.statusCode === 401 &&
			err?.statusMessage === 'ERR_INCORRECT_PASSWORD'
		) {
			isPasswordError.value = true;
		} else {
			error.value =
				translateServerError(err, t.value) || 'Failed to change password.';
			closePasswordModal();
		}
	} finally {
		isChangingPassword.value = false;
	}
}

useEscapeKey(() => {
	if (isShowPasswordModal.value) {
		closePasswordModal();
	}
});

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
	color: #fff;
	background: #74d66d;
	font-weight: 700;
	font-size: 1rem;
	border: 2px solid #74d66d;
	padding: 0.75rem 1.5rem;
	border-radius: 999px;
	transition: all 0.2s;
	box-shadow: 0 2px 8px rgba(116, 214, 109, 0.3);
}

.back-link:hover {
	background: #5ec854;
	border-color: #5ec854;
	box-shadow: 0 4px 12px rgba(116, 214, 109, 0.4);
	transform: translateY(-1px);
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
	border-top-color: #74d66d;
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

.form-group-full {
	grid-column: 1 / -1;
}

.form-group label {
	display: block;
	margin-bottom: 0.4rem;
	font-weight: 600;
	color: #444;
}

.form-group .language-label {
	display: flex !important;
	align-items: center;
	gap: 0.5rem;
}

.language-label::before {
	content: '';
	width: 18px;
	height: 18px;
	display: inline-block;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23444444' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E");
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	flex-shrink: 0;
}

.radio-group {
	display: flex;
	gap: 1.5rem;
	margin-top: 0.5rem;
}

.radio-label {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	cursor: pointer;
	font-weight: 400;
	color: #555;
}

.radio-label input[type='radio'] {
	width: auto;
	cursor: pointer;
	accent-color: #74d66d;
	margin-right: 0.5rem;
}

.radio-label span {
	user-select: none;
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
	border-color: #74d66d;
	box-shadow: 0 0 0 3px rgba(116, 214, 109, 0.15);
}

.btn-primary {
	align-self: flex-start;
	background: #74d66d;
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
	background: #d4e8d2;
	cursor: not-allowed;
}

.btn-primary:not(:disabled):hover {
	background: #5ec854;
}

.btn-change-password {
	background: #74d66d;
	color: #fff;
	border: 2px solid #74d66d;
	border-radius: 999px;
	padding: 0.75rem 1.75rem;
	font-size: 1rem;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: 0 2px 8px rgba(116, 214, 109, 0.3);
}

.btn-change-password:hover {
	background: #5ec854;
	border-color: #5ec854;
	box-shadow: 0 4px 12px rgba(116, 214, 109, 0.4);
	transform: translateY(-1px);
}

.btn-secondary {
	background: #e5e5e5;
	color: #333;
	border: none;
	border-radius: 999px;
	padding: 0.75rem 1.75rem;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s;
}

.btn-secondary:hover {
	background: #d4d4d4;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
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

.modal-content {
	background: #fff;
	border-radius: 16px;
	padding: 2rem;
	max-width: 480px;
	width: 90%;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
}

.modal-header h2 {
	margin: 0;
	font-size: 1.5rem;
	color: #222;
}

.close-btn {
	background: none;
	border: none;
	font-size: 2rem;
	color: #999;
	cursor: pointer;
	padding: 0;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.2s;
}

.close-btn:hover {
	background: #f0f0f0;
	color: #333;
}

.password-form {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.password-form .form-group {
	margin: 0;
}

.modal-actions {
	display: flex;
	gap: 1rem;
	justify-content: flex-end;
	margin-top: 0.5rem;
}

.input-error {
	border-color: #c63737 !important;
}

.error-message {
	display: block;
	color: #c63737;
	font-size: 0.85rem;
	margin-top: 0.4rem;
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
