<template>
	<div class="container" v-cloak>
		<!-- Signup Form (shown when not authenticated) -->
		<div v-if="!isAuthenticated" class="auth-container">
			<h1>{{ t.welcome }}</h1>
			<form @submit.prevent="handleSignup" class="signup-form">
				<h2>{{ isShowSignin ? t.signin : t.signup }}</h2>

				<div v-if="error" class="error">{{ error }}</div>

				<div v-if="!isShowSignin" class="form-group">
					<label for="name">{{ t.name }}</label>
					<input
						id="name"
						v-model="name"
						type="text"
						required
						:placeholder="t.enterName"
					/>
				</div>

				<!-- Removed misplaced ChessBoard from signup form -->
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

				<button type="submit" class="btn-primary" :disabled="isLoading">
					{{ isLoading ? t.pleaseWait : isShowSignin ? t.signin : t.signup }}
				</button>

				<p class="toggle-auth">
					{{ isShowSignin ? t.noAccount : t.haveAccount }}
					<a @click="toggleAuthMode" href="#">
						{{ isShowSignin ? t.signup : t.signin }}
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

			<!-- Loading state -->
			<div v-if="isGameLoading" class="game-status">
				<p>{{ t.loadingGame }}</p>
			</div>

			<!-- Waiting for opponent state -->
			<div v-else-if="!currentGame" class="game-status">
				<p>{{ t.waitingForOpponent }}</p>
				<div class="loading-spinner"></div>
			</div>

			<!-- Active game -->
			<div v-else class="active-game">
				<div class="game-info">
					<div class="game-id">
						{{ t.gameId }}: <code>{{ currentGame.id }}</code>
					</div>
					<div class="timer-section">
						<h3>{{ t.yourTurn }}</h3>
						<div class="timer">
							<div class="timer-label">{{ t.timeRemaining }}:</div>
							<div class="timer-value" :class="{ warning: timeRemaining < 60 }">
								{{ formatTime(timeRemaining) }}
							</div>
						</div>
					</div>
				</div>
				<!-- 
				<div>
					{{ currentGame.history }}
				</div> -->
				<div class="chessboard-area">
					<ChessBoard
						:fen="displayFen"
						:player-color="playerColor"
						:is-viewing-history="isViewingHistory"
						@move="handleMove"
					/>

					<!-- Parent-controlled history navigation -->
					<div class="parent-history-bar">
						<div class="history-message" v-if="isViewingHistory">
							{{ t.gameHistory }}
						</div>
						<div class="history-controls">
							<button
								class="history-btn"
								@click.prevent="goBack"
								:disabled="isAtStart"
								:aria-label="t.previousPosition"
							>
								‹
							</button>
							<span class="history-pos"
								>{{ historyIndex + 1 }} / {{ totalPositions }}</span
							>
							<button
								class="history-btn"
								@click.prevent="goForward"
								:disabled="isAtEnd"
								:aria-label="t.nextPosition"
							>
								›
							</button>
						</div>

						<div
							class="history-player"
							v-if="currentGame && currentMovePlayerData"
						>
							<span class="move-by">{{
								isViewingHistory ? t.moveBy : t.lastMoveBy
							}}</span>
							<span class="move-name"
								>{{ currentMovePlayerData.name }} ({{ t.score }} :
								{{ currentMovePlayerData.score }})</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Win Modal -->
	<div v-if="isShowWinModal" class="modal-overlay">
		<div class="modal-content">
			<h1 class="win-title">🎉 {{ t.winCongrats }} 🎉</h1>
			<p class="score-change">
				{{ t.winScoreChange({ prevScore, newScore }) }}
			</p>
			<button class="close-btn" @click="isShowWinModal = false">
				{{ t.close }}
			</button>
		</div>
	</div>
	<div v-else-if="isShowDrawModal" class="modal-overlay">
		<div class="modal-content">
			<h1 class="win-title">{{ t.gameDrawn }}</h1>
			<button class="close-btn" @click="isShowDrawModal = false">
				{{ t.close }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
// Remove static import of canvas-confetti
import { Chess } from 'chess.js';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import ChessBoard from '~/components/ChessBoard.vue';
import { useAuth } from '~/composables/useAuth';
import { translations as t } from '~/composables/useI18n';
import { translateServerError } from '~/composables/useServerErrors';
import { maxMoveTimeMins } from '~/constants/game';

// console.log('index.vue loaded');
// console.log(t.winScoreChange({ prevScore: 2222, newScore: 3333 }));

definePageMeta({
	ssr: false,
});

const { user, isAuthenticated, signup, signin, signout, getAuthHeader } =
	useAuth();

// Form state
const name = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');
const isShowSignin = ref(false);

// Game state
const currentGame = ref<any>(null);
const isGameLoading = ref(false);
const timeRemaining = ref(maxMoveTimeMins * 60); // seconds
const pollIntervalId = ref<ReturnType<typeof setInterval> | null>(null);
const timerIntervalId = ref<ReturnType<typeof setInterval> | null>(null);
const prevScore = ref<number | null>(null);
const newScore = ref<number | null>(null);

// Win modal state
const isShowWinModal = ref(false);
const isShowDrawModal = ref(false);

function triggerWin(_prevScore?: number, _newScore?: number) {
	isShowWinModal.value = true;
	prevScore.value = _prevScore ?? null;
	newScore.value = _newScore ?? null;

	if (typeof window !== 'undefined') {
		import('canvas-confetti').then((mod) => {
			mod.default({
				particleCount: 200,
				spread: 90,
				origin: { y: 0.7 },
			});
		});
	}
}

const currentFen = computed(() => {
	return currentGame.value.history[currentGame.value.history.length - 1].fen;
});

// Parent-controlled history index for navigation UI
const historyIndex = ref(0);

// Reset history index whenever the game is (re)loaded
watch(currentGame, (g) => {
	if (g && g.history && g.history.length)
		historyIndex.value = g.history.length - 1;
	else historyIndex.value = 0;
});

const totalPositions = computed(() => currentGame.value?.history?.length ?? 0);
const displayFen = computed(() => {
	if (!currentGame.value) return currentFen.value;
	const idx = Math.min(
		Math.max(0, historyIndex.value),
		currentGame.value.history.length - 1
	);
	return currentGame.value.history[idx].fen;
});

const isViewingHistory = computed(() => {
	return (
		currentGame.value &&
		historyIndex.value !== currentGame.value.history.length - 1
	);
});

const isAtStart = computed(() => historyIndex.value <= 0);
const isAtEnd = computed(() => {
	if (!currentGame.value) return true;
	return historyIndex.value >= currentGame.value.history.length - 1;
});

function goBack() {
	if (historyIndex.value > 0) historyIndex.value--;
}

function goForward() {
	if (
		currentGame.value &&
		historyIndex.value < currentGame.value.history.length - 1
	)
		historyIndex.value++;
}

const currentMovePlayerData = computed(() => {
	const entry = currentGame.value.history[historyIndex.value];
	const uid = entry.userId;
	const map = (currentGame.value as any).userDataMap ?? {};
	// console.log(map);
	return map[uid];
});

const playerColor = computed(() => {
	if (!currentGame.value || !user.value) return 'white';

	const chess = new Chess(currentFen.value);
	const currentTurn = chess.turn(); // 'w' or 'b'

	// If user is assigned to white
	if (currentGame.value.whiteUserIds?.includes(user.value._id)) {
		return 'white';
	}
	// If user is assigned to black
	if (currentGame.value.blackUserIds?.includes(user.value._id)) {
		return 'black';
	}

	// If not assigned, assign based on current turn
	return currentTurn === 'w' ? 'white' : 'black';
});

function toggleAuthMode() {
	isShowSignin.value = !isShowSignin.value;
	error.value = '';
	password.value = '';
}

// Translator provided by `composables/useServerErrors` — imported above

async function handleSignup() {
	error.value = '';
	isLoading.value = true;

	try {
		let result;
		if (isShowSignin.value) {
			result = await signin(email.value, password.value);
		} else {
			result = await signup(name.value, email.value, password.value);
		}

		if (!result.success) {
			error.value = translateServerError(result.error, t);
		}
	} catch (e: any) {
		error.value = translateServerError(e, t);
	} finally {
		isLoading.value = false;
	}
}

function handleSignout() {
	signout();
	// Reset form
	name.value = '';
	email.value = '';
	password.value = '';
	error.value = '';

	// Clear game state
	stopPolling();
	stopTimer();
	currentGame.value = null;
}

async function loadGame(excludeGameId?: string) {
	if (excludeGameId || (!currentGame.value && !isGameLoading.value)) {
		try {
			isGameLoading.value = true;
			const params = excludeGameId ? `?gameId=${excludeGameId}` : '';
			const authHeaders = getAuthHeader();
			const response = await $fetch(
				`/api/game${params}`,
				authHeaders ? { headers: authHeaders } : {}
			);

			if (response) {
				currentGame.value = response;
				startTimer();
			} else {
				currentGame.value = null;
				stopTimer();
				// Start polling for a new game
				startPolling();
			}
		} catch (e) {
			console.error('Error loading game:', e);
			currentGame.value = null;
			startPolling();
		} finally {
			isGameLoading.value = false;
		}
	}
}

type MoveResponse = {
	fen: string;
	success: boolean;
	result: any;
};

async function handleMove(move: {
	from: string;
	to: string;
	promotion?: string;
}) {
	if (!currentGame.value) return;

	try {
		const moveData = {
			gameId: currentGame.value._id,
			move: move.promotion ? { ...move, promotion: move.promotion } : move,
		};

		const authHeaders = getAuthHeader();
		const res = await $fetch<MoveResponse>('/api/move', {
			method: 'POST',
			body: moveData,
			headers: authHeaders,
		});
		if (res?.result.gameResult === 'draw') {
			isShowDrawModal.value = true;
		} else if (['white-win', 'black-win'].includes(res?.result.gameResult)) {
			triggerWin(res.result.prevScore, res.result.newScore);
		}
		// Move was successful, load next game
		stopTimer();
		await loadGame(currentGame.value._id);
	} catch (e: any) {
		console.error('Error making move:', e);
		// Use shared translator
		error.value = translateServerError(e, t) || 'Failed to make move';
	}
}

function startTimer() {
	stopTimer();
	timeRemaining.value = maxMoveTimeMins * 60;

	timerIntervalId.value = setInterval(() => {
		timeRemaining.value--;

		if (timeRemaining.value <= 0) {
			stopTimer();
			// Time's up, load a different game
			if (currentGame.value) {
				loadGame(currentGame.value._id);
			}
		}
	}, 1000);
}

function stopTimer() {
	if (timerIntervalId.value) {
		clearInterval(timerIntervalId.value);
		timerIntervalId.value = null;
	}
}

function startPolling() {
	stopPolling();

	pollIntervalId.value = setInterval(async () => {
		if (!currentGame.value) {
			await loadGame();
		}
	}, 2000);
}

function stopPolling() {
	if (pollIntervalId.value) {
		clearInterval(pollIntervalId.value);
		pollIntervalId.value = null;
	}
}

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Watch authentication state
watch(isAuthenticated, (newVal) => {
	if (newVal) {
		loadGame();
	} else {
		stopPolling();
		stopTimer();
		currentGame.value = null;
	}
});

// Load game on mount if authenticated
onMounted(() => {
	if (isAuthenticated.value) {
		loadGame();
	}
});

// Cleanup on unmount
onUnmounted(() => {
	stopPolling();
	stopTimer();
});
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

.game-id {
	font-size: 0.9rem;
	color: #666;
	margin-bottom: 0.75rem;
	word-break: break-all;
	font-family: 'Courier New', monospace;
}

.game-status {
	text-align: center;
	padding: 4rem 2rem;
}

.game-status p {
	font-size: 1.5rem;
	color: #666;
	margin-bottom: 2rem;
}

.loading-spinner {
	width: 50px;
	height: 50px;
	border: 4px solid #f3f3f3;
	border-top: 4px solid #4caf50;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin: 0 auto;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.active-game {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
	max-width: 600px;
	margin: 0 auto;
	padding: 1rem;
}

.chessboard-area {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
	margin-top: 1.5rem;
	margin-bottom: 1.5rem;
	width: 100%;
	max-width: 480px;
	height: auto;
	max-height: none;
	padding: 0.5rem;
	overflow: visible;
}

.chessboard-area > * {
	width: 100%;
	height: auto;
	display: block;
}

.chessboard-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2rem 0;
	background: #f5f5dc;
	border-radius: 12px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	width: 100%;
	max-width: 480px;
	margin: 0 auto;
}

.game-info {
	width: 100%;
	max-width: 480px;
}

.timer-section {
	background: #f9f9f9;
	padding: 1.5rem;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timer-section h3 {
	margin: 0 0 1rem 0;
	color: #333;
	font-size: 1.5rem;
	text-align: center;
}

.timer {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
	font-size: 1.25rem;
}

.timer-label {
	color: #666;
	font-weight: 500;
}

.timer-value {
	color: #4caf50;
	font-weight: bold;
	font-size: 1.5rem;
	font-family: 'Courier New', monospace;
}

.timer-value.warning {
	color: #f44336;
	animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.6;
	}
}

/* Mobile optimizations */
@media (max-width: 600px) {
	.active-game {
		padding: 0.5rem;
		gap: 1rem;
	}

	.timer-section {
		padding: 1rem;
	}

	.timer-section h3 {
		font-size: 1.25rem;
	}

	.timer {
		font-size: 1rem;
	}

	.timer-value {
		font-size: 1.25rem;
	}
}

/* Parent history controls (in-flow under board) */
.parent-history-bar {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 8px;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	position: relative;
}
.parent-history-bar .history-controls {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
}
.parent-history-bar .history-btn {
	background: #222;
	color: #fff;
	border: none;
	padding: 6px 10px;
	border-radius: 6px;
	cursor: pointer;
	min-width: 40px;
	height: 36px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}
.parent-history-bar .history-pos {
	display: inline-block;
	white-space: nowrap;
	font-size: 0.95rem;
	color: #222;
	background: #f3f3f3;
	padding: 6px 10px;
	border-radius: 6px;
}

.parent-history-bar .history-player {
	margin-top: 8px;
	font-size: 0.95rem;
	color: #444;
	text-align: center;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
}
.parent-history-bar .move-by {
	font-weight: 600;
	color: #666;
}
.parent-history-bar .move-name {
	color: #333;
	font-weight: 500;
}

/* Position the small label above the controls so it doesn't shift layout */
.parent-history-bar .history-message {
	position: absolute;
	top: -30px;
	left: 50%;
	transform: translateX(-50%);
	background: transparent;
	padding: 0 6px;
	font-weight: 600;
	pointer-events: none;
}

/* Disabled state for parent buttons: gray out and use default arrow cursor */
.parent-history-bar .history-btn[disabled] {
	opacity: 0.35;
	cursor: default;
	background: #555;
	color: #ddd;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}
.modal-content {
	background: #fff;
	padding: 3rem 2rem;
	border-radius: 16px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	text-align: center;
}
.win-title {
	font-size: 2.2rem;
	color: #4caf50;
	margin-bottom: 2rem;
}
.close-btn {
	padding: 0.75rem 2rem;
	font-size: 1.1rem;
	background: #4caf50;
	color: #fff;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.2s;
}
.close-btn:hover {
	background: #388e3c;
}
</style>
