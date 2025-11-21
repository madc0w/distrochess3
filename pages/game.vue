<template>
	<div class="container" v-cloak>
		<div class="game-container">
			<div class="game-header">
				<h1>{{ t.distroChess }}</h1>
				<div class="user-info">
					<span>{{ t.welcome }}, {{ user?.name }}!</span>
					<NuxtLink to="/settings" class="btn-settings">
						{{ t.settings.button }}
					</NuxtLink>
					<button @click="handleSignout" class="btn-signout">
						{{ t.signout }}
					</button>
				</div>
			</div>

			<div v-if="errorMessage" class="game-alert">
				{{ errorMessage }}
			</div>

			<div v-if="isGameLoading" class="game-status">
				<p>{{ t.loadingGame }}</p>
			</div>
			<div v-else-if="!currentGame" class="game-status">
				<p>{{ t.waitingForOpponent }}</p>
				<div class="loading-spinner"></div>
			</div>
			<div v-else class="active-game">
				<div class="chessboard-area">
					<ChessBoard
						:fen="displayFen"
						:player-color="playerColor"
						:is-viewing-history="isViewingHistory"
						@move="handleMove"
					/>

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
								{{ Math.round(currentMovePlayerData.score) }})</span
							>
						</div>
						<div class="game-id-container">
							{{ t.gameId }}: <span id="game-id">{{ currentGame.id }}</span>
						</div>
					</div>
				</div>
				<div class="timer-section timer-below">
					<h3>{{ t.yourTurn }}</h3>
					<div class="timer">
						<div class="timer-label">{{ t.timeRemaining }}:</div>
						<div class="timer-value" :class="{ warning: timeRemaining < 20 }">
							{{ formatTime(timeRemaining) }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div v-if="isShowWinModal" class="modal-overlay">
		<div class="modal-content">
			<div class="win-header">
				<span class="win-icon" aria-hidden="true">🎉</span>
				<h1 class="win-title">{{ t.winCongrats }}</h1>
				<span class="win-icon" aria-hidden="true">🎉</span>
			</div>
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
import { Chess } from 'chess.js';
import { computed, onUnmounted, ref, watch } from 'vue';
import ChessBoard from '~/components/ChessBoard.vue';
import { useAuth } from '~/composables/useAuth';
import { useEscapeKey } from '~/composables/useEscapeKey';
import { useI18n } from '~/composables/useI18n';
import { translateServerError } from '~/composables/useServerErrors';
import { maxMoveTimeMins } from '~/constants/game';

definePageMeta({
	ssr: false,
});

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { user, isAuthenticated, signout, getAuthHeader } = useAuth();

const currentGame = ref<any>(null);
const isGameLoading = ref(false);
const timeRemaining = ref(maxMoveTimeMins * 60);
const pollIntervalId = ref<ReturnType<typeof setInterval> | null>(null);
const timerIntervalId = ref<ReturnType<typeof setInterval> | null>(null);
const prevScore = ref<number | null>(null);
const newScore = ref<number | null>(null);

const isShowWinModal = ref(false);
const isShowDrawModal = ref(false);
const errorMessage = ref('');
const manualSignoutRedirect = ref<string | null>(null);
let loadSequence: Promise<void> = Promise.resolve();

const requestedGameId = computed(() => {
	const raw = Array.isArray(route.query.gameId)
		? route.query.gameId[0]
		: route.query.gameId;
	return typeof raw === 'string' && raw.length ? raw : undefined;
});

useEscapeKey((event) => {
	if (isShowWinModal.value) {
		isShowWinModal.value = false;
		event.preventDefault();
		return;
	}
	if (isShowDrawModal.value) {
		isShowDrawModal.value = false;
		event.preventDefault();
	}
});

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

const historyIndex = ref(0);

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
	return map[uid];
});

const playerColor = computed(() => {
	if (!currentGame.value || !user.value) return 'white';

	const chess = new Chess(currentFen.value);
	const currentTurn = chess.turn();

	if (currentGame.value.whiteUserIds?.includes(user.value._id)) {
		return 'white';
	}
	if (currentGame.value.blackUserIds?.includes(user.value._id)) {
		return 'black';
	}

	return currentTurn === 'w' ? 'white' : 'black';
});

function handleSignout() {
	manualSignoutRedirect.value = '/';
	signout();
	stopPolling();
	stopTimer();
	currentGame.value = null;
	router.replace('/');
}

type LoadGameOptions = {
	excludeGameId?: string;
	requestedGameId?: string;
	force?: boolean;
};

async function loadGame(options: LoadGameOptions = {}) {
	const shouldForce = Boolean(
		options.force || options.excludeGameId || options.requestedGameId
	);
	if (isGameLoading.value && !shouldForce) {
		return currentGame.value;
	}

	isGameLoading.value = true;

	try {
		const params = new URLSearchParams();
		if (options.excludeGameId) {
			params.set('gameId', options.excludeGameId);
		}
		if (options.requestedGameId) {
			params.set('requestedGameId', options.requestedGameId);
		}
		const query = params.toString();
		const url = query ? `/api/game?${query}` : '/api/game';
		const authHeaders = getAuthHeader();
		const response = await $fetch(
			url,
			authHeaders ? { headers: authHeaders } : {}
		);

		if (response) {
			currentGame.value = response;
			stopPolling();
			startTimer();
		} else {
			currentGame.value = null;
			stopTimer();
			startPolling();
		}

		return response;
	} catch (e) {
		if (!options.requestedGameId) {
			console.error('Error loading game:', e);
			currentGame.value = null;
			startPolling();
			return null;
		}
		throw e;
	} finally {
		isGameLoading.value = false;
	}
}

async function loadRequestedGame(gameId: string) {
	errorMessage.value = '';
	try {
		const response = await loadGame({
			requestedGameId: gameId,
			force: true,
		});
		return Boolean(response);
	} catch (err: any) {
		const statusMessage =
			err?.statusMessage ||
			err?.data?.statusMessage ||
			err?.response?.statusMessage ||
			err?.statusCode;
		if (statusMessage === 'GAME_NOT_FOUND') {
			errorMessage.value = t.value.requestedGameNotFound;
		} else if (statusMessage === 'GAME_NOT_AVAILABLE') {
			errorMessage.value = t.value.requestedGameNotAvailable;
		} else {
			errorMessage.value =
				translateServerError(err, t.value) || t.value.errors.ERR_GENERIC;
		}
		return false;
	}
}

function isCurrentGame(gameId: string) {
	if (!currentGame.value) return false;
	const currentId =
		currentGame.value._id?.toString?.() ?? currentGame.value._id;
	return currentId === gameId || String(currentGame.value.id ?? '') === gameId;
}

function queueGameLoad() {
	loadSequence = loadSequence
		.catch(() => undefined)
		.then(() => loadAccordingToQuery())
		.catch((err) => {
			console.error('Failed to load game from queue', err);
			errorMessage.value =
				translateServerError(err, t.value) || t.value.errors.ERR_GENERIC;
		});
}

async function loadAccordingToQuery() {
	if (!isAuthenticated.value) return;

	const targetGameId = requestedGameId.value;
	if (targetGameId) {
		if (isCurrentGame(targetGameId)) {
			errorMessage.value = '';
			return;
		}
		const loadedRequested = await loadRequestedGame(targetGameId);
		if (loadedRequested) {
			return;
		}
		await loadGame({ force: true });
		return;
	}

	if (!currentGame.value) {
		await loadGame();
	}
}

function redirectToSignin() {
	const target = route.fullPath || '/game';
	router.replace({
		path: '/signin',
		query: { redirect: target },
	});
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
		stopTimer();
		await loadGame({
			excludeGameId: currentGame.value._id,
			force: true,
		});
	} catch (e: any) {
		const friendly = translateServerError(e, t.value) || 'Failed to make move';
		console.error('Error making move:', friendly, e);
	}
}

function startTimer() {
	stopTimer();
	timeRemaining.value = maxMoveTimeMins * 60;

	timerIntervalId.value = setInterval(() => {
		timeRemaining.value--;

		if (timeRemaining.value <= 0) {
			stopTimer();
			if (currentGame.value) {
				loadGame({
					excludeGameId: currentGame.value._id,
					force: true,
				});
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

watch(
	() => isAuthenticated.value,
	(newVal) => {
		if (newVal) {
			queueGameLoad();
		} else {
			stopPolling();
			stopTimer();
			currentGame.value = null;
			if (manualSignoutRedirect.value) {
				manualSignoutRedirect.value = null;
				return;
			}
			redirectToSignin();
		}
	},
	{ immediate: true }
);

watch(requestedGameId, (newVal, oldVal) => {
	if (!isAuthenticated.value) return;
	if (newVal === oldVal) return;
	queueGameLoad();
});

onUnmounted(() => {
	stopPolling();
	stopTimer();
});
</script>

<style scoped>
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 1.25rem;
	min-height: 100vh;
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

.game-container {
	padding: 1.25rem 0;
}

.game-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.25rem;
	padding-bottom: 0.5rem;
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

.btn-settings {
	padding: 0.5rem 1rem;
	border: 1px solid #4caf50;
	color: #4caf50;
	border-radius: 4px;
	font-size: 0.9rem;
	text-decoration: none;
	transition: background 0.2s, color 0.2s;
}

.btn-settings:hover {
	background: #4caf50;
	color: #fff;
}

.btn-signout:hover {
	background: #d32f2f;
}

.game-status {
	text-align: center;
	padding: 2.5rem 1.5rem;
}

.game-alert {
	margin-bottom: 1rem;
	padding: 0.75rem 1rem;
	border-radius: 8px;
	background: #fff6e5;
	color: #92400e;
	border: 1px solid #fcd34d;
	font-weight: 500;
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
	gap: 1.25rem;
	max-width: 600px;
	margin: 0 auto;
	padding: 0.5rem;
}

.chessboard-area {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
	margin-top: 0.75rem;
	margin-bottom: 0.75rem;
	width: 100%;
	max-width: 480px;
	padding: 0.25rem 0.5rem;
}

.chessboard-area > * {
	width: 100%;
	display: block;
}

.timer-section {
	background: #f9f9f9;
	padding: 1.25rem;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timer-section.timer-below {
	width: 100%;
	max-width: 480px;
	margin: 0.5rem auto;
}

.timer-section h3 {
	margin: 0 0 0.5rem 0;
	color: #333;
	font-size: 1.5rem;
	text-align: center;
}

.timer {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.35rem;
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

.parent-history-bar {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 4px;
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
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

.parent-history-bar .game-id-container {
	margin-top: 6px;
	font-size: 0.9rem;
	color: #666;
	text-align: center;
}

.parent-history-bar #game-id {
	color: #333;
	font-weight: 600;
}

.parent-history-bar .move-by {
	font-weight: 600;
	color: #666;
}

.parent-history-bar .move-name {
	color: #333;
	font-weight: 500;
}

.parent-history-bar .history-message {
	font-weight: 600;
	color: #444;
	margin-bottom: 4px;
}

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
	width: min(90vw, 520px);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
}

.win-header {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	width: 100%;
}

.win-icon {
	font-size: 2.5rem;
}

.win-title {
	font-size: 2.2rem;
	color: #4caf50;
	margin: 0;
}

.score-change {
	margin: 0;
	font-size: 1.1rem;
	color: #444;
	line-height: 1.45;
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
	min-width: 160px;
}

.close-btn:hover {
	background: #388e3c;
}

@media (max-width: 600px) {
	.user-info {
		flex-direction: column;
		align-items: flex-start;
	}

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

	.modal-content {
		padding: 2.5rem 1.5rem;
		width: min(95vw, 420px);
	}

	.win-title {
		font-size: 1.8rem;
	}
}
</style>
