<template>
	<div class="container" v-cloak>
		<!-- Signup Form (shown when not authenticated) -->
		<div v-if="!isAuthenticated" class="auth-container">
			<h1>{{ t.welcome }}</h1>
			<form @submit.prevent="handleSignup" class="signup-form">
				<h2>{{ showSignin ? t.signin : t.signup }}</h2>

				<div v-if="error" class="error">{{ error }}</div>

				<div v-if="!showSignin" class="form-group">
					<label for="name">{{ t.name }}</label>
					<input
						id="name"
						v-model="name"
						type="text"
						required
						:placeholder="t.enterName"
					/>
				</div>

				<div class="form-group">
					<label for="email">{{ t.email }}</label>
					<input
						id="email"
						v-model="email"
						type="email"
						required
						:placeholder="t.enterEmail"
					/>
				</div>

				<div class="form-group">
					<label for="password">{{ t.password }}</label>
					<input
						id="password"
						v-model="password"
						type="password"
						required
						:placeholder="t.enterPassword"
						:minlength="6"
					/>
				</div>

				<button type="submit" class="btn-primary" :disabled="loading">
					{{ loading ? t.pleaseWait : showSignin ? t.signin : t.signup }}
				</button>

				<p class="toggle-auth">
					{{ showSignin ? t.noAccount : t.haveAccount }}
					<a @click="toggleAuthMode" href="#">
						{{ showSignin ? t.signup : t.signin }}
					</a>
				</p>
			</form>
		</div>

		<!-- Game View (shown when authenticated) -->
		<div v-else class="game-container">
			<div class="game-header">
				<h1>{{ t.distroChess }}</h1>
				<div class="user-info">
					<span>{{ t.welcome }}, {{ user?.name }}!</span>
					<button @click="handleSignout" class="btn-signout">
						{{ t.signout }}
					</button>
				</div>
			</div>

			<div class="game-placeholder">
				<p>{{ t.gamePlaceholder }}</p>
				<p class="game-info">{{ t.gameComingSoon }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { translations as t } from '~/composables/useI18n';

definePageMeta({
	ssr: false,
});

const { user, isAuthenticated, signup, signin, signout } = useAuth();

// Form state
const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const showSignin = ref(false);

function toggleAuthMode() {
	showSignin.value = !showSignin.value;
	error.value = '';
	password.value = '';
}

async function handleSignup() {
	error.value = '';
	loading.value = true;

	try {
		let result;
		if (showSignin.value) {
			result = await signin(email.value, password.value);
		} else {
			result = await signup(name.value, email.value, password.value);
		}

		if (!result.success) {
			error.value = result.error || 'Authentication failed';
		}
	} catch (e: any) {
		error.value = e.message || 'An error occurred';
	} finally {
		loading.value = false;
	}
}

function handleSignout() {
	signout();
	// Reset form
	name.value = '';
	email.value = '';
	password.value = '';
	error.value = '';
}
</script>

<style scoped>
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
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

.auth-container {
	max-width: 400px;
	margin: 4rem auto;
}

.auth-container h1 {
	text-align: center;
	margin-bottom: 2rem;
	color: #333;
}

.signup-form {
	background: #f9f9f9;
	padding: 2rem;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.signup-form h2 {
	margin-top: 0;
	margin-bottom: 1.5rem;
	color: #333;
	text-align: center;
}

.form-group {
	margin-bottom: 1.5rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	font-weight: 500;
	color: #555;
}

.form-group input {
	width: 100%;
	padding: 0.75rem;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 1rem;
	box-sizing: border-box;
}

.form-group input:focus {
	outline: none;
	border-color: #4caf50;
}

.error {
	background: #fee;
	color: #c33;
	padding: 0.75rem;
	border-radius: 4px;
	margin-bottom: 1rem;
	font-size: 0.9rem;
}

.btn-primary {
	width: 100%;
	padding: 0.75rem;
	background: #4caf50;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 1rem;
	font-weight: 500;
	cursor: pointer;
	transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
	background: #45a049;
}

.btn-primary:disabled {
	background: #ccc;
	cursor: not-allowed;
}

.toggle-auth {
	text-align: center;
	margin-top: 1rem;
	color: #666;
}

.toggle-auth a {
	color: #4caf50;
	cursor: pointer;
	text-decoration: none;
}

.toggle-auth a:hover {
	text-decoration: underline;
}

.game-container {
	padding: 2rem 0;
}

.game-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	padding-bottom: 1rem;
	border-bottom: 2px solid #eee;
}

.game-header h1 {
	margin: 0;
	color: #333;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.user-info span {
	color: #666;
	font-weight: 500;
}

.btn-signout {
	padding: 0.5rem 1rem;
	background: #f44336;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 0.9rem;
	cursor: pointer;
	transition: background 0.2s;
}

.btn-signout:hover {
	background: #d32f2f;
}

.game-placeholder {
	background: #f9f9f9;
	border: 2px dashed #ddd;
	border-radius: 8px;
	padding: 4rem 2rem;
	text-align: center;
	margin: 2rem 0;
}

.game-placeholder p {
	font-size: 1.5rem;
	color: #666;
	margin: 0.5rem 0;
}

.game-info {
	font-size: 1rem !important;
	color: #999 !important;
}
</style>
