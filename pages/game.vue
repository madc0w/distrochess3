<template>
	<div class="container" v-cloak>
		<div class="game-container">
			<div class="game-header">
				<h1>
					<img src="/logo-small.jpg" alt="DistroChess" class="game-logo" />
					<span class="game-title-text">{{ t.distroChess }}</span>
					<NuxtLink to="/faq" class="btn-faq">
						{{ t.faq.linkLabel }}
					</NuxtLink>
					<NuxtLink to="/leaderboard" class="btn-faq">
						{{ t.leaderboard.linkLabel }}
					</NuxtLink>
				</h1>
				<div class="user-info">
					<div class="profile-dropdown">
						<button
							class="btn-profile"
							@click="toggleProfileMenu"
							:aria-label="t.profile || 'Profile'"
							ref="profileButton"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								width="24"
								height="24"
								fill="currentColor"
							>
								<path
									d="M256 0c141.385 0 256 114.615 256 256S397.385 512 256 512 0 397.385 0 256 114.615 0 256 0zm0 480c123.712 0 224-100.288 224-224S379.712 32 256 32 32 132.288 32 256s100.288 224 224 224z"
								/>
								<path
									d="M256 192c35.346 0 64-28.654 64-64s-28.654-64-64-64-64 28.654-64 64 28.654 64 64 64zm0-96c17.673 0 32 14.327 32 32s-14.327 32-32 32-32-14.327-32-32 14.327-32 32-32zm116.8 192c-22.4-28.8-67.2-48-116.8-48s-94.4 19.2-116.8 48c-6.4 9.6-9.6 19.2-9.6 32 0 35.2 28.8 64 64 64h128c35.2 0 64-28.8 64-64 0-12.8-3.2-22.4-12.8-32zm-180.8 64c-17.6 0-32-14.4-32-32 0-3.2 0-6.4 3.2-9.6 12.8-19.2 51.2-38.4 92.8-38.4s80 19.2 92.8 38.4c3.2 3.2 3.2 6.4 3.2 9.6 0 17.6-14.4 32-32 32H192z"
								/>
							</svg>
						</button>
						<Teleport to="body">
							<div
								v-if="isShowingProfileMenu"
								class="profile-menu"
								:style="profileMenuPosition"
							>
								<div class="profile-menu-header">
									<strong>{{ displayUser?.name }}</strong>
								</div>
								<div class="profile-menu-item">
									<span class="profile-label">Score:</span>
									<span class="profile-value">{{
										Math.round(displayUser?.score ?? 0)
									}}</span>
								</div>
								<div class="profile-menu-item">
									<span class="profile-label">Wins:</span>
									<span class="profile-value">{{
										displayUser?.wins?.length ?? 0
									}}</span>
								</div>
								<div class="profile-menu-item">
									<span class="profile-label">Losses:</span>
									<span class="profile-value">{{
										displayUser?.losses?.length ?? 0
									}}</span>
								</div>
								<div class="profile-menu-item">
									<span class="profile-label">Draws:</span>
									<span class="profile-value">{{
										displayUser?.draws?.length ?? 0
									}}</span>
								</div>
								<div class="profile-menu-divider"></div>
								<button
									class="profile-menu-settings"
									@click="navigateToSettings"
								>
									<img src="/settings.svg" alt="" class="settings-icon-small" />
									{{ t.settings.button }}
								</button>
							</div>
						</Teleport>
					</div>
					<button
						class="btn-team-chat"
						@click="toggleChatModal"
						:disabled="!canUseTeamChat || !currentGame"
						:title="!canUseTeamChat ? t.teamChat.disabledHint : undefined"
					>
						{{ t.teamChat.button }}
						<span v-if="chatUnreadCount > 0" class="chat-badge">
							{{ chatUnreadCount }}
						</span>
					</button>
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
						:is-draw-offered="isDrawOfferedToUser"
						@move="handleMove"
						@blocked-move="handleBlockedMove"
					/>

					<div class="parent-history-bar">
						<div class="history-row">
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
						</div>
						<button
							v-if="isViewingHistory"
							class="history-pill history-pill-btn"
							@click="exitHistory"
						>
							{{ t.exitHistory }}
						</button>

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
					<h3 v-if="!isDrawOfferedToUser">{{ t.yourTurn }}</h3>
					<h3 v-else class="draw-offered-title">{{ t.drawOffered.title }}</h3>
					<div class="timer" v-if="!isDrawOfferedToUser">
						<!-- <div class="timer-label">{{ t.timeRemaining }}:</div> -->
						<div class="timer-value" :class="{ warning: timeRemaining < 20 }">
							{{ formatTime(timeRemaining) }}
						</div>
					</div>
					<div v-if="isDrawOfferedToUser" class="draw-offered-actions">
						<button
							:class="['btn-accept-draw', { pulse: isPulsingDrawButtons }]"
							@click="handleAcceptDraw"
							:disabled="!currentGame"
						>
							{{ t.drawOffered.accept }}
						</button>
						<button
							:class="['btn-decline-draw', { pulse: isPulsingDrawButtons }]"
							@click="handleDeclineDraw"
							:disabled="!currentGame"
						>
							{{ t.drawOffered.decline }}
						</button>
					</div>
					<div v-else class="pass-btn-container">
						<button
							class="btn-pass"
							@click="handlePass"
							:disabled="!currentGame"
						>
							{{ t.pass }}
						</button>
						<button
							class="btn-offer-draw"
							@click="showOfferDrawModal"
							:disabled="!currentGame || !canOfferDraw"
						>
							{{ t.offerDraw }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div
		v-if="isShowWinModal"
		class="modal-overlay"
		@click="isShowWinModal = false"
	>
		<div class="modal-content" @click.stop>
			<div class="win-header">
				<span class="win-icon" aria-hidden="true">🎉</span>
				<h1 class="win-title">{{ t.winCongrats }}</h1>
				<span class="win-icon" aria-hidden="true">🎉</span>
			</div>
			<p class="score-change">
				{{
					t.winScoreChange({
						prevScore: prevScore ? Math.round(prevScore) : '?',
						newScore: newScore ? Math.round(newScore) : '?',
					})
				}}
			</p>
			<button class="close-btn" @click="isShowWinModal = false">
				{{ t.close }}
			</button>
		</div>
	</div>
	<div
		v-else-if="isShowDrawModal"
		class="modal-overlay"
		@click="isShowDrawModal = false"
	>
		<div class="modal-content" @click.stop>
			<h1 class="win-title">{{ t.gameDrawn }}</h1>
			<button class="close-btn" @click="isShowDrawModal = false">
				{{ t.close }}
			</button>
		</div>
	</div>

	<div
		v-if="isMoveErrorModalVisible"
		class="modal-overlay error-modal"
		@click="hideMoveErrorModal"
	>
		<div class="modal-content error-modal-content" @click.stop>
			<h2 class="error-title">{{ t.moveErrors.notYourTurnTitle }}</h2>
			<p class="error-message">{{ moveErrorModalMessage }}</p>
		</div>
	</div>

	<div
		v-if="isOfferDrawModalVisible"
		class="modal-overlay"
		@click="isOfferDrawModalVisible = false"
	>
		<div class="modal-content" @click.stop>
			<h2 class="modal-title">{{ t.drawOffer.title }}</h2>
			<p class="modal-message" v-html="t.drawOffer.message"></p>
			<div class="modal-actions">
				<button class="btn-primary" @click="handleOfferDraw">
					{{ t.drawOffer.confirm }}
				</button>
				<button class="btn-secondary" @click="isOfferDrawModalVisible = false">
					{{ t.drawOffer.cancel }}
				</button>
			</div>
		</div>
	</div>

	<div
		v-if="isChatOpen"
		class="modal-overlay chat-overlay"
		@click="closeChatModal"
	>
		<div
			class="chat-modal"
			role="dialog"
			aria-modal="true"
			:aria-label="t.teamChat.title"
			@click.stop
		>
			<div class="chat-header">
				<div>
					<h2>{{ t.teamChat.title }}</h2>
					<p class="chat-subtitle">{{ t.teamChat.subtitle }}</p>
				</div>
				<button
					class="chat-close"
					@click="closeChatModal"
					:aria-label="t.close"
				>
					×
				</button>
			</div>
			<div v-if="chatErrorMessage" class="chat-error">
				{{ chatErrorMessage }}
			</div>
			<div class="chat-body" ref="chatBodyRef">
				<div v-if="isChatLoading && !chatMessages.length" class="chat-loading">
					{{ t.teamChat.loading }}
				</div>
				<div v-else-if="!chatMessages.length" class="chat-empty">
					{{ t.teamChat.empty }}
				</div>
				<div v-else class="chat-messages">
					<div
						v-for="msg in chatMessages"
						:key="msg.id"
						class="chat-message"
						:class="{ 'chat-message-self': msg.userId === user?._id }"
					>
						<div class="chat-meta">
							<span class="chat-author">
								{{ resolveChatUserName(msg.userId) }}
								<span v-if="msg.userId === user?._id" class="chat-self-tag">
									{{ t.teamChat.you }}
								</span>
							</span>
							<div class="chat-meta-details">
								<button
									type="button"
									v-if="typeof msg.moveNumber === 'number'"
									class="chat-move"
									@click="handleChatMoveJump(msg.moveNumber)"
									:aria-label="
										t.teamChat.moveNumberLabel({ move: msg.moveNumber + 1 })
									"
									:title="
										t.teamChat.moveNumberLabel({ move: msg.moveNumber + 1 })
									"
								>
									{{ t.teamChat.moveNumberLabel({ move: msg.moveNumber + 1 }) }}
								</button>
								<span class="chat-time">
									{{ formatChatTimestamp(msg.createdDateStr) }}
								</span>
							</div>
						</div>
						<p class="chat-text">{{ msg.message }}</p>
					</div>
				</div>
			</div>
			<form class="chat-form" @submit.prevent="sendChatMessage">
				<textarea
					class="chat-input"
					rows="3"
					v-model="chatInput"
					:placeholder="t.teamChat.placeholder"
					@keydown.enter.exact.prevent="sendChatMessage"
				></textarea>
				<div class="chat-form-actions">
					<button
						type="button"
						class="chat-emoji-btn"
						:aria-pressed="isEmojiPickerOpen"
						@click="toggleEmojiPicker"
						:title="t.teamChat.emojiToggle"
					>
						😊
					</button>
					<button
						type="submit"
						class="chat-send-btn"
						:disabled="isChatSending || !chatInput.trim()"
					>
						{{ isChatSending ? t.teamChat.sending : t.teamChat.send }}
					</button>
				</div>
				<emoji-picker
					v-if="isEmojiPickerOpen"
					class="emoji-picker"
					@emoji-click="handleEmojiSelect"
				/>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Chess } from 'chess.js';
import 'emoji-picker-element';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import ChessBoard from '~/components/ChessBoard.vue';
import { useAuth } from '~/composables/useAuth';
import { useEscapeKey } from '~/composables/useEscapeKey';
import { useI18n } from '~/composables/useI18n';
import { translateServerError } from '~/composables/useServerErrors';
import { maxMoveTimeMins, minMovesToEnableDrawOffers } from '~/constants/game';
import { formatDate } from '~/utils/formatDate';

definePageMeta({
	ssr: false,
});

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();
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
const MOVE_ERROR_MODAL_DURATION_MS = 2000;

type TeamChatMessage = {
	id: string;
	gameId: string;
	side: 'white' | 'black';
	userId: string;
	message: string;
	createdDateStr: string;
	moveNumber: number | null;
};

type EmojiClickEventDetail = {
	unicode?: string;
	emoji?: {
		unicode?: string;
	};
};

type TeamChatResponse = {
	messages: TeamChatMessage[];
	lastSeenAt: string | null;
};

const isChatOpen = ref(false);
const chatMessages = ref<TeamChatMessage[]>([]);
const chatInput = ref('');
const chatErrorMessage = ref('');
const isChatLoading = ref(false);
const isChatSending = ref(false);
const chatUnreadCount = ref(0);
const chatIntervalId = ref<ReturnType<typeof setInterval> | null>(null);
const lastSeenChatTimestamp = ref<string | null>(null);
const lastPersistedChatTimestamp = ref<string | null>(null);
const pendingLastSeenUpload = ref<string | null>(null);
const isPersistingLastSeen = ref(false);
const chatBodyRef = ref<HTMLElement | null>(null);
const isEmojiPickerOpen = ref(false);
const pendingTimerReload = ref<LoadGameOptions | null>(null);
const isMoveErrorModalVisible = ref(false);
const moveErrorModalMessage = ref('');
const moveErrorModalTimerId = ref<ReturnType<typeof setTimeout> | null>(null);

const isShowingProfileMenu = ref(false);
const profileButton = ref<HTMLElement | null>(null);
const profileMenuPosition = ref({});
const freshUserData = ref<any>(null);
const isOfferDrawModalVisible = ref(false);
const isPulsingDrawButtons = ref(false);

const isDrawOfferedToUser = computed(() => {
	if (!currentGame.value || !user.value) return false;
	const drawOfferUserId = currentGame.value.drawOfferUserId;
	if (!drawOfferUserId) return false;
	// Draw is offered TO the current user if someone else offered it
	return drawOfferUserId.toString() !== user.value._id.toString();
});

const requestedGameId = computed(() => {
	const raw = Array.isArray(route.query.gameId)
		? route.query.gameId[0]
		: route.query.gameId;
	return typeof raw === 'string' && raw.length ? raw : undefined;
});

const userTeamSide = computed<'white' | 'black' | null>(() => {
	if (currentGame.value && user.value) {
		if (listIncludesUser(currentGame.value.whiteUserIds, user.value._id)) {
			return 'white';
		} else if (
			listIncludesUser(currentGame.value.blackUserIds, user.value._id)
		) {
			return 'black';
		}
	}
	return null;
});

const canUseTeamChat = computed(() => {
	// console.log('canUseTeamChat:', currentGame.value, userTeamSide.value);
	return Boolean(currentGame.value?._id && userTeamSide.value);
});

const displayUser = computed(() => freshUserData.value || user.value);

async function fetchFreshUserData() {
	const headers = getAuthHeader();
	if (!headers) return;
	try {
		const data = await $fetch('/api/user', { headers });
		freshUserData.value = data;
	} catch (err) {
		console.error('Failed to fetch user data:', err);
	}
}

function listIncludesUser(list: any[] = [], value?: string | null) {
	if (!value) return false;
	return list.some((entry) => entry?.toString?.() === value);
}

const toggleProfileMenu = () => {
	isShowingProfileMenu.value = !isShowingProfileMenu.value;

	if (isShowingProfileMenu.value) {
		fetchFreshUserData();
		if (profileButton.value) {
			nextTick(() => {
				const rect = profileButton.value!.getBoundingClientRect();
				const menuWidth = 220; // min-width from CSS
				const menuHeight = 350; // approximate height
				const padding = 8;
				const viewportWidth = window.innerWidth;
				const viewportHeight = window.innerHeight;

				// Calculate initial position
				let top = rect.bottom + padding;
				let right = viewportWidth - rect.right;

				// Prevent overflow on the right
				const leftPosition = viewportWidth - right - menuWidth;
				if (leftPosition < padding) {
					right = viewportWidth - menuWidth - padding;
				}

				// Prevent overflow on the left
				if (right > viewportWidth - menuWidth - padding) {
					right = viewportWidth - menuWidth - padding;
				}

				// Prevent overflow on the bottom
				if (top + menuHeight > viewportHeight - padding) {
					// Position above the button instead
					top = rect.top - menuHeight - padding;
					// If still doesn't fit, position at the top with some padding
					if (top < padding) {
						top = padding;
					}
				}

				profileMenuPosition.value = {
					position: 'fixed',
					top: `${top}px`,
					right: `${right}px`,
					zIndex: 999999,
				};
			});
		}
	}
};

const navigateToSettings = () => {
	isShowingProfileMenu.value = false;
	router.push('/settings');
};

if (process.client) {
	onMounted(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest('.profile-dropdown')) {
				isShowingProfileMenu.value = false;
			}
		};
		document.addEventListener('click', handleClickOutside);
		onUnmounted(() => {
			document.removeEventListener('click', handleClickOutside);
		});
	});
}

useEscapeKey((event) => {
	if (isShowingProfileMenu.value) {
		isShowingProfileMenu.value = false;
		event.preventDefault();
		return;
	}
	if (isOfferDrawModalVisible.value) {
		isOfferDrawModalVisible.value = false;
		event.preventDefault();
		return;
	}
	if (isChatOpen.value) {
		closeChatModal();
		event.preventDefault();
		return;
	}
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

// Allow draw offers only after more than inMovesToEnableDrawOffers moves
const canOfferDraw = computed(() => {
	return (currentGame.value?.history?.length ?? 0) > minMovesToEnableDrawOffers;
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

function exitHistory() {
	if (!currentGame.value) return;
	historyIndex.value = currentGame.value.history.length - 1;
}

function jumpToHistoryPosition(targetIndex: number) {
	if (!currentGame.value || !currentGame.value.history?.length) return;
	const maxIndex = currentGame.value.history.length - 1;
	const nextIndex = Math.min(Math.max(0, targetIndex), maxIndex);
	historyIndex.value = nextIndex;
}

function handleChatMoveJump(targetIndex: number) {
	jumpToHistoryPosition(targetIndex);
	closeChatModal();
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
	// stopChatPolling();
	resetChatState();
	currentGame.value = null;
	router.replace('/');
}

async function handlePass() {
	if (!currentGame.value) return;

	const currentGameId = currentGame.value._id;
	await loadGame({
		excludeGameId: currentGameId,
		isForce: true,
	});
}

function showOfferDrawModal() {
	isOfferDrawModalVisible.value = true;
}

async function handleOfferDraw() {
	if (!currentGame.value) return;
	isOfferDrawModalVisible.value = false;

	try {
		const authHeaders = getAuthHeader();
		await $fetch('/api/draw-offer', {
			method: 'POST',
			body: { gameId: currentGame.value._id },
			headers: authHeaders,
		});
		// Load next game after offering draw
		await loadGame({
			excludeGameId: currentGame.value._id,
			isForce: true,
		});
	} catch (e: any) {
		const friendly = translateServerError(e, t.value) || 'Failed to offer draw';
		console.error('Error offering draw:', friendly, e);
	}
}

async function handleAcceptDraw() {
	if (!currentGame.value) return;

	try {
		const authHeaders = getAuthHeader();
		await $fetch('/api/draw-respond', {
			method: 'POST',
			body: { gameId: currentGame.value._id, isAcceptDraw: true },
			headers: authHeaders,
		});
		isShowDrawModal.value = true;
		await loadGame({
			excludeGameId: currentGame.value._id,
			isForce: true,
		});
	} catch (e: any) {
		const friendly =
			translateServerError(e, t.value) || 'Failed to accept draw';
		console.error('Error accepting draw:', friendly, e);
	}
}

async function handleDeclineDraw() {
	if (!currentGame.value) return;

	try {
		const authHeaders = getAuthHeader();
		await $fetch('/api/draw-respond', {
			method: 'POST',
			body: { gameId: currentGame.value._id, isAcceptDraw: false },
			headers: authHeaders,
		});
		// Immediately load next game after declining
		await loadGame({
			excludeGameId: currentGame.value._id,
			isForce: true,
		});
	} catch (e: any) {
		const friendly =
			translateServerError(e, t.value) || 'Failed to decline draw';
		console.error('Error declining draw:', friendly, e);
	}
}

type LoadGameOptions = {
	excludeGameId?: string;
	requestedGameId?: string;
	isForce?: boolean;
};

async function loadGame(options: LoadGameOptions = {}) {
	const isForce = Boolean(
		options.isForce || options.excludeGameId || options.requestedGameId
	);
	if (isGameLoading.value && !isForce) {
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
			isForce: true,
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
		await loadGame({ isForce: true });
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

function handleBlockedMove() {
	// Trigger pulse animation when move is blocked due to draw offer
	isPulsingDrawButtons.value = true;
	setTimeout(() => {
		isPulsingDrawButtons.value = false;
	}, 600);
}

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
			isForce: true,
		});
	} catch (e: any) {
		if (isNotYourTurnError(e)) {
			showMoveErrorModal(t.value.moveErrors.notYourTurnMessage);
			return;
		}
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
				const reloadOptions: LoadGameOptions = {
					excludeGameId: currentGame.value._id,
					isForce: true,
				};
				if (isChatOpen.value) {
					pendingTimerReload.value = reloadOptions;
				} else {
					void loadGame(reloadOptions);
				}
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
	}, 4000);
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

function isTimestampLater(candidate: string | null, reference: string | null) {
	if (!candidate) return false;
	if (!reference) return true;
	return new Date(candidate).getTime() > new Date(reference).getTime();
}

function toggleChatModal() {
	if (isChatOpen.value) closeChatModal();
	else openChatModal();
}

function openChatModal() {
	if (!canUseTeamChat.value) return;
	isChatOpen.value = true;
	fetchChatMessages({ force: true });
	scrollChatToBottom();
}

function closeChatModal() {
	if (!isChatOpen.value) return;
	isChatOpen.value = false;
	isEmojiPickerOpen.value = false;
}

async function sendChatMessage() {
	if (isChatSending.value) return;
	const trimmed = chatInput.value.trim();
	const gameId = getCurrentGameId();
	if (!trimmed || !gameId) return;
	isChatSending.value = true;
	const headers = getAuthHeader();
	try {
		await $fetch('/api/chat', {
			method: 'POST',
			body: { gameId, message: trimmed },
			...(headers ? { headers } : {}),
		});
		chatInput.value = '';
		chatErrorMessage.value = '';
		await fetchChatMessages({ force: true });
		await scrollChatToBottom();
	} catch (err: any) {
		chatErrorMessage.value =
			translateServerError(err, t.value) || t.value.teamChat.sendError;
	} finally {
		isChatSending.value = false;
	}
}

function toggleEmojiPicker() {
	if (!isChatOpen.value) {
		isEmojiPickerOpen.value = false;
		return;
	}
	isEmojiPickerOpen.value = !isEmojiPickerOpen.value;
}

function handleEmojiSelect(event: CustomEvent<EmojiClickEventDetail>) {
	const detail = event.detail;
	const emojiValue = detail?.unicode || (detail as any)?.emoji?.unicode;
	if (!emojiValue) return;
	chatInput.value += emojiValue;
	isEmojiPickerOpen.value = false;
}

function queuePersistLastSeen(timestamp: string | null) {
	if (!timestamp) return;
	if (
		lastPersistedChatTimestamp.value &&
		!isTimestampLater(timestamp, lastPersistedChatTimestamp.value)
	) {
		return;
	}
	pendingLastSeenUpload.value = timestamp;
	if (!isPersistingLastSeen.value) {
		void persistPendingLastSeen();
	}
}

async function persistPendingLastSeen() {
	const timestamp = pendingLastSeenUpload.value;
	const targetGameId = getCurrentGameId();
	if (!timestamp || !targetGameId) return;
	if (
		lastPersistedChatTimestamp.value &&
		!isTimestampLater(timestamp, lastPersistedChatTimestamp.value)
	) {
		pendingLastSeenUpload.value = null;
		return;
	}
	isPersistingLastSeen.value = true;
	pendingLastSeenUpload.value = null;
	const headers = getAuthHeader();
	try {
		const res = await $fetch<{ lastSeenAt: string }>('/api/chat/seen', {
			method: 'POST',
			body: { gameId: targetGameId, lastSeenAt: timestamp },
			...(headers ? { headers } : {}),
		});
		if (targetGameId === getCurrentGameId()) {
			lastPersistedChatTimestamp.value = res.lastSeenAt ?? timestamp;
		}
	} catch (err) {
		console.error('Failed to persist chat last-seen timestamp', err);
	} finally {
		isPersistingLastSeen.value = false;
		if (pendingLastSeenUpload.value) {
			void persistPendingLastSeen();
		}
	}
}

function resolveChatUserName(userId: string) {
	const map = (currentGame.value as any)?.userDataMap ?? {};
	return map?.[userId]?.name ?? t.value.unknownPlayer;
}

function formatChatTimestamp(value: string) {
	return formatDate(value, locale.value || 'en', '');
}

function clearMoveErrorModalTimer() {
	if (moveErrorModalTimerId.value) {
		clearTimeout(moveErrorModalTimerId.value);
		moveErrorModalTimerId.value = null;
	}
}

function hideMoveErrorModal() {
	isMoveErrorModalVisible.value = false;
	moveErrorModalMessage.value = '';
	clearMoveErrorModalTimer();
}

function scheduleNextGameLoad() {
	const options: LoadGameOptions = { isForce: true };
	const currentId = getCurrentGameId();
	if (currentId) {
		options.excludeGameId = currentId;
	}
	void loadGame(options);
}

function showMoveErrorModal(message: string) {
	clearMoveErrorModalTimer();
	moveErrorModalMessage.value = message;
	isMoveErrorModalVisible.value = true;
	moveErrorModalTimerId.value = setTimeout(() => {
		moveErrorModalTimerId.value = null;
		hideMoveErrorModal();
		scheduleNextGameLoad();
	}, MOVE_ERROR_MODAL_DURATION_MS);
}

function isNotYourTurnError(err: any) {
	const code =
		err?.statusMessage ||
		err?.data?.statusMessage ||
		err?.response?.statusMessage ||
		err?.response?._data?.statusMessage;
	return code === 'ERR_NOT_YOUR_TURN';
}

function getCurrentGameId(): string | null {
	const raw = currentGame.value?._id ?? null;
	if (!raw) return null;
	return typeof raw === 'string' ? raw : raw?.toString?.() ?? null;
}

async function fetchChatMessages(options: { force?: boolean } = {}) {
	if (!canUseTeamChat.value) return;
	const gameId = getCurrentGameId();
	if (!gameId) return;
	if (isChatLoading.value && !options.force) return;
	isChatLoading.value = true;
	const headers = getAuthHeader();
	try {
		const response = await $fetch<TeamChatResponse>('/api/chat', {
			query: { gameId },
			...(headers ? { headers } : {}),
		});
		const latestGameId = getCurrentGameId();
		if (latestGameId !== gameId) {
			return;
		}
		chatMessages.value = response.messages;
		chatErrorMessage.value = '';
		const serverLastSeen = response.lastSeenAt;
		if (serverLastSeen) {
			if (isTimestampLater(serverLastSeen, lastPersistedChatTimestamp.value)) {
				lastPersistedChatTimestamp.value = serverLastSeen;
			}
			if (isTimestampLater(serverLastSeen, lastSeenChatTimestamp.value)) {
				lastSeenChatTimestamp.value = serverLastSeen;
			}
		} else {
			lastPersistedChatTimestamp.value = null;
			lastSeenChatTimestamp.value = null;
		}

		updateUnreadCountFromMessages();
	} catch (err: any) {
		chatErrorMessage.value =
			translateServerError(err, t.value) || t.value.teamChat.loadError;
	} finally {
		isChatLoading.value = false;
	}
}

// function startChatPolling() {
// 	stopChatPolling();
// 	if (!canUseTeamChat.value || !getCurrentGameId()) return;
// 	fetchChatMessages({ force: true });
// 	chatIntervalId.value = setInterval(() => {
// 		fetchChatMessages();
// 	}, 5000);
// }

// function stopChatPolling() {
// 	if (chatIntervalId.value) {
// 		clearInterval(chatIntervalId.value);
// 		chatIntervalId.value = null;
// 	}
// }

function resetChatState() {
	chatMessages.value = [];
	chatInput.value = '';
	chatErrorMessage.value = '';
	chatUnreadCount.value = 0;
	lastSeenChatTimestamp.value = null;
	lastPersistedChatTimestamp.value = null;
	pendingLastSeenUpload.value = null;
	isChatOpen.value = false;
	isEmojiPickerOpen.value = false;
	pendingTimerReload.value = null;
}

function markChatAsRead() {
	const lastMessage = chatMessages.value[chatMessages.value.length - 1];
	let targetTimestamp: string | null = null;
	if (lastMessage) {
		targetTimestamp = lastMessage.createdDateStr;
	} else if (!lastSeenChatTimestamp.value) {
		targetTimestamp = new Date().toISOString();
	}
	if (targetTimestamp) {
		if (
			isTimestampLater(targetTimestamp, lastSeenChatTimestamp.value) ||
			!lastSeenChatTimestamp.value
		) {
			lastSeenChatTimestamp.value = targetTimestamp;
		}
		queuePersistLastSeen(targetTimestamp);
	}
	chatUnreadCount.value = 0;
}

function updateUnreadCountFromMessages() {
	if (chatMessages.value.length) {
		if (lastSeenChatTimestamp.value) {
			const lastSeen = new Date(lastSeenChatTimestamp.value).getTime();
			chatUnreadCount.value = chatMessages.value.filter((msg) => {
				const msgTime = new Date(msg.createdDateStr).getTime();
				return msgTime > lastSeen;
			}).length;
		} else {
			chatUnreadCount.value = chatMessages.value.length;
		}
	} else {
		chatUnreadCount.value = 0;
	}
}

async function scrollChatToBottom() {
	await nextTick();
	if (chatBodyRef.value) {
		chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
	}
}

watch(
	() => ({
		gameId: getCurrentGameId(),
		canChat: canUseTeamChat.value,
	}),
	(newState, oldState) => {
		const isGameChanged = newState.gameId !== oldState?.gameId;
		if (isGameChanged || !newState.canChat) {
			resetChatState();
		}
		// Fetch chat messages when game changes to update unread count
		if (newState.gameId && newState.canChat && isGameChanged) {
			fetchChatMessages({ force: true });
		}
	},
	{ immediate: true }
);

watch(chatMessages, () => {
	if (isChatOpen.value) {
		markChatAsRead();
		scrollChatToBottom();
	} else {
		updateUnreadCountFromMessages();
	}
});

watch(isChatOpen, (open) => {
	if (open) {
		markChatAsRead();
		scrollChatToBottom();
	} else {
		isEmojiPickerOpen.value = false;
		markChatAsRead();
		if (pendingTimerReload.value) {
			const options = pendingTimerReload.value;
			pendingTimerReload.value = null;
			void loadGame(options);
		}
	}
});

watch(
	() => isAuthenticated.value,
	(newVal) => {
		if (newVal) {
			queueGameLoad();
		} else {
			stopPolling();
			stopTimer();
			// stopChatPolling();
			resetChatState();
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
	// stopChatPolling();
	clearMoveErrorModalTimer();
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

@media (max-width: 600px) {
	.container {
		padding: 0.5rem;
	}
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
	flex-wrap: wrap;
	gap: 1rem;
}

.game-header h1 {
	margin: 0;
	color: #333;
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.game-logo {
	height: 48px;
	width: auto;
	border-radius: 8px;
}

.game-title-text {
	font-size: 1.75rem;
	font-weight: 600;
	color: inherit;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.user-info span {
	color: #666;
	font-weight: 500;
}

.btn-signout {
	padding: 0.5rem 1rem;
	background: #f44336;
	color: white;
	border: 1px solid #f44336;
	border-radius: 4px;
	font-size: 0.9rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.btn-faq {
	padding: 0.5rem 1rem;
	border: 1px solid #5cb85c;
	color: #fff;
	border-radius: 4px;
	font-size: 0.9rem;
	font-weight: 500;
	text-decoration: none;
	background: #5cb85c;
	transition: all 0.2s ease;
	margin-left: 0.75rem;
}

.btn-faq:hover {
	background: #4a9d4a;
	border-color: #4a9d4a;
}

.profile-dropdown {
	position: relative;
	z-index: 100000;
}

.btn-profile {
	padding: 0.5rem;
	border: 2px solid #5cb85c;
	background: #5cb85c;
	color: #fff;
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
}

.btn-profile:hover {
	background: #4a9d4a;
	border-color: #4a9d4a;
	transform: scale(1.1);
}

.btn-profile svg {
	width: 24px;
	height: 24px;
}

.profile-menu {
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	overflow: hidden;
	min-width: 220px;
	max-width: calc(100vw - 16px);
	max-height: calc(100vh - 16px);
	animation: slideDownMenu 0.2s ease-out;
	pointer-events: auto;
	overflow-y: auto;
}

@keyframes slideDownMenu {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.profile-menu-header {
	padding: 1rem;
	background: #f9f9f9;
	border-bottom: 1px solid #eee;
	text-align: center;
	font-size: 1rem;
	color: #333;
}

.profile-menu-item {
	padding: 0.75rem 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #f5f5f5;
	font-size: 0.9rem;
}

.profile-label {
	color: #666;
	font-weight: 500;
}

.profile-value {
	color: #333;
	font-weight: 600;
}

.profile-menu-divider {
	height: 1px;
	background: #ddd;
	margin: 0.5rem 0;
}

.profile-menu-settings {
	padding: 0.5rem 1rem;
	margin: 0.75rem;
	border: 1px solid #5cb85c;
	background: #5cb85c;
	color: #fff;
	border-radius: 4px;
	font-size: 0.9rem;
	font-weight: 500;
	text-decoration: none;
	transition: background 0.2s, transform 0.1s;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.4rem;
	width: calc(100% - 1.5rem);
	box-sizing: border-box;
	cursor: pointer;
	font-family: inherit;
}

.profile-menu-settings:hover {
	background: #4a9d4a;
	border-color: #4a9d4a;
	transform: translateY(-1px);
}

.settings-icon-small {
	width: 16px;
	height: 16px;
}

.btn-team-chat {
	padding: 0.5rem 1rem;
	border-radius: 4px;
	border: 1px solid #2563eb;
	background: #2563eb;
	color: #fff;
	font-size: 0.9rem;
	font-weight: 500;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	transition: all 0.2s ease;
}

.btn-team-chat:disabled {
	opacity: 0.45;
	cursor: not-allowed;
}

.btn-team-chat:not(:disabled):hover {
	background: #1d4ed8;
	border-color: #1d4ed8;
}

.chat-badge {
	background: #f97316;
	color: #fff;
	border-radius: 999px;
	padding: 0 0.45rem;
	font-size: 0.7rem;
	font-weight: 700;
	line-height: 1.4;
}

.btn-signout:hover {
	background: #d32f2f;
	border-color: #d32f2f;
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
	border-top: 4px solid #74d66d;
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
	gap: 0.5rem;
	max-width: 600px;
	margin: 0 auto;
	padding: 0.5rem;
}

@media (max-width: 600px) {
	.active-game {
		padding: 0.25rem;
		gap: 0.25rem;
	}
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
	margin-bottom: 0.25rem;
	width: 100%;
	max-width: min(480px, 95vw);
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

.pass-btn-container {
	display: flex;
	justify-content: center;
	gap: 0.75rem;
	margin-top: 0.5rem;
	flex-wrap: wrap;
}

.btn-pass {
	padding: 0.5rem 1rem;
	background: #64748b;
	color: white;
	border: 1px solid #64748b;
	border-radius: 4px;
	font-size: 0.9rem;
	font-weight: 800;
	cursor: pointer;
	transition: all 0.2s ease;
	width: 120px;
}

.btn-pass:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-pass:not(:disabled):hover {
	background: #475569;
	border-color: #475569;
}

.btn-offer-draw {
	padding: 0.5rem 1rem;
	background: #f59e0b;
	/* color: white; */
	border: 1px solid #f59e0b;
	border-radius: 4px;
	font-size: 0.9rem;
	font-weight: 800;
	cursor: pointer;
	transition: all 0.2s ease;
	width: 120px;
}

.btn-offer-draw:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-offer-draw:not(:disabled):hover {
	background: #d97706;
	border-color: #d97706;
}

.draw-offered-title {
	color: #f59e0b;
	font-size: 1.5rem;
	text-align: center;
	margin: 0 0 1rem 0;
}

.draw-offered-actions {
	display: flex;
	justify-content: center;
	gap: 0.75rem;
	margin-top: 0.5rem;
	flex-wrap: wrap;
}

.btn-accept-draw {
	padding: 0.5rem 1rem;
	background: #22c55e;
	color: white;
	border: 1px solid #22c55e;
	border-radius: 4px;
	font-size: 0.9rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	min-width: 140px;
}

.btn-accept-draw:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-accept-draw:not(:disabled):hover {
	background: #16a34a;
	border-color: #16a34a;
}

.btn-decline-draw {
	padding: 0.5rem 1rem;
	background: #64748b;
	color: white;
	border: 1px solid #64748b;
	border-radius: 4px;
	font-size: 0.9rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	min-width: 140px;
}

.btn-decline-draw:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-decline-draw:not(:disabled):hover {
	background: #475569;
	border-color: #475569;
}

@keyframes pulseButton {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
}

.btn-accept-draw.pulse,
.btn-decline-draw.pulse {
	animation: pulseButton 0.3s ease-in-out 2;
}

.timer-section.timer-below {
	width: 100%;
	max-width: min(480px, 95vw);
	margin: 0 auto;
}

@media (max-width: 600px) {
	.timer-section {
		padding: 1rem;
	}

	.timer-section h3 {
		font-size: 1.25rem;
	}
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
	color: #2d8a26;
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

.parent-history-bar .history-row {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.65rem;
}

.parent-history-bar .history-controls {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
}

.parent-history-bar .history-pill {
	font-weight: 700;
	color: #1e293b;
	background: #e2e8f0;
	border: 1px solid #cbd5f5;
	border-radius: 999px;
	padding: 0.25rem 0.85rem;
	font-size: 0.85rem;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	margin-top: 0.5rem;
}

.parent-history-bar .history-pill-btn {
	cursor: pointer;
	transition: all 0.2s ease;
	font-family: inherit;
}

.parent-history-bar .history-pill-btn:hover {
	background: #cbd5e1;
	border-color: #94a3b8;
	transform: translateY(-1px);
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
	display: inline-block;
	animation: pulseGameId 0.5s ease-in-out 3;
}

@keyframes pulseGameId {
	0% {
		transform: scale(1);
		color: #333;
		font-weight: 600;
	}
	50% {
		transform: scale(1.8);
		color: #74d66d;
		font-weight: 900;
	}
	100% {
		transform: scale(1);
		color: #333;
		font-weight: 600;
	}
}

.parent-history-bar .move-by {
	font-weight: 600;
	color: #666;
}

.parent-history-bar .move-name {
	color: #333;
	font-weight: 500;
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

.error-modal-content {
	border-top: 4px solid #f97316;
	gap: 0.75rem;
	padding: 2rem 1.5rem;
}

.error-title {
	margin: 0;
	color: #b45309;
	font-size: 1.6rem;
}

.error-message {
	margin: 0;
	color: #92400e;
	font-size: 1rem;
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
	color: #74d66d;
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
	background: #74d66d;
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

.modal-title {
	font-size: 1.8rem;
	color: #333;
	margin: 0 0 1rem 0;
}

.modal-message {
	margin: 0 0 1.5rem 0;
	font-size: 1rem;
	color: #444;
	line-height: 1.6;
}

.modal-actions {
	display: flex;
	justify-content: center;
	gap: 0.75rem;
	flex-wrap: wrap;
	width: 100%;
}

.btn-primary {
	padding: 0.75rem 1.5rem;
	font-size: 1rem;
	background: #f59e0b;
	/* color: #fff; */
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.2s;
	min-width: 160px;
	font-weight: 800;
}

.btn-primary:hover {
	background: #d97706;
}

.btn-secondary {
	padding: 0.75rem 1.5rem;
	font-size: 1rem;
	background: #e5e7eb;
	color: #374151;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.2s;
	min-width: 160px;
	font-weight: 800;
}

.btn-secondary:hover {
	background: #d1d5db;
}

.chat-overlay {
	z-index: 10000;
}

.chat-modal {
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 8px 32px rgba(15, 23, 42, 0.25);
	padding: 1.5rem;
	width: min(92vw, 480px);
	max-height: 85vh;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.chat-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
}

.chat-header h2 {
	margin: 0;
	font-size: 1.5rem;
	color: #0f172a;
}

.chat-subtitle {
	margin: 0.15rem 0 0;
	color: #475569;
	font-size: 0.9rem;
}

.chat-close {
	border: none;
	background: transparent;
	font-size: 1.5rem;
	line-height: 1;
	cursor: pointer;
	color: #475569;
}

.chat-error {
	background: #fef3c7;
	color: #92400e;
	border: 1px solid #fde68a;
	border-radius: 10px;
	padding: 0.5rem 0.75rem;
	font-size: 0.85rem;
}

.chat-body {
	background: #f8fafc;
	border-radius: 12px;
	padding: 0.75rem;
	max-height: 45vh;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.chat-loading,
.chat-empty {
	color: #64748b;
	text-align: center;
	font-size: 0.9rem;
	padding: 1rem 0;
}

.chat-messages {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.chat-message {
	background: #fff;
	border-radius: 12px;
	padding: 0.5rem 0.75rem;
	box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.chat-message-self {
	background: #dbeafe;
	align-self: flex-end;
}

.chat-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.35rem;
	flex-wrap: wrap;
	font-size: 0.75rem;
	color: #64748b;
}

.chat-meta-details {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	color: inherit;
}

.chat-author {
	font-weight: 600;
	color: #0f172a;
}

.chat-message-self .chat-author {
	color: #1e3a8a;
}

.chat-message-self .chat-meta {
	color: #1e3a8a;
}

.chat-move {
	font-weight: 600;
	color: inherit;
	background: transparent;
	border: 1px solid currentColor;
	border-radius: 999px;
	padding: 0.1rem 0.55rem;
	font-size: 0.75rem;
	line-height: 1.2;
	cursor: pointer;
	appearance: none;
	-webkit-appearance: none;
	transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.chat-move:hover {
	background: rgba(15, 23, 42, 0.08);
}

.chat-message-self .chat-move:hover {
	background: rgba(30, 58, 138, 0.15);
}

.chat-move:focus-visible {
	outline: 2px solid #2563eb;
	outline-offset: 2px;
}

.chat-self-tag {
	margin-left: 0.35rem;
	padding: 0 0.4rem;
	border-radius: 999px;
	background: rgba(37, 99, 235, 0.17);
	font-size: 0.65rem;
	font-weight: 700;
	letter-spacing: 0.05em;
	text-transform: uppercase;
}

.chat-time {
	color: inherit;
	white-space: nowrap;
}

.chat-text {
	margin: 0;
	color: #0f172a;
	word-break: break-word;
}

.chat-form {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.chat-input {
	width: 100%;
	border: 1px solid #cbd5f5;
	border-radius: 10px;
	padding: 0.75rem;
	font-size: 0.95rem;
	font-family: inherit;
	resize: none;
}

.chat-input:focus {
	outline: 2px solid #2563eb;
	outline-offset: 1px;
}

.chat-form-actions {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 0.5rem;
}

.chat-emoji-btn {
	width: 38px;
	height: 38px;
	border-radius: 50%;
	border: 1px solid #cbd5f5;
	background: #fff;
	font-size: 1.1rem;
	line-height: 1;
	cursor: pointer;
	transition: background 0.2s ease, border-color 0.2s ease;
}

.chat-emoji-btn[aria-pressed='true'] {
	background: #e0f2fe;
	border-color: #0ea5e9;
}

.chat-emoji-btn:hover:not(:disabled) {
	background: #f1f5f9;
}

.chat-send-btn {
	border: none;
	border-radius: 999px;
	background: #2563eb;
	color: #fff;
	font-weight: 600;
	padding: 0.5rem 1.5rem;
	cursor: pointer;
	transition: opacity 0.2s ease;
}

.chat-send-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.emoji-picker {
	width: 100%;
	max-height: 280px;
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(15, 23, 42, 0.15);
	overflow: hidden;
}

@media (max-width: 768px) {
	.game-header {
		justify-content: center;
	}

	.game-header h1 {
		flex-basis: 100%;
		justify-content: center;
		text-align: center;
	}

	.user-info {
		flex-basis: 100%;
		justify-content: center;
	}

	.game-title-text {
		font-size: 1.25rem;
	}

	.game-logo {
		height: 52px;
		border-radius: 8px;
	}

	.btn-faq {
		padding: 0.4rem 0.7rem;
		font-size: 0.8rem;
		margin-left: 0.5rem;
	}

	.btn-profile {
		width: 40px;
		height: 40px;
	}

	.btn-team-chat,
	.btn-signout {
		padding: 0.4rem 0.8rem;
		font-size: 0.85rem;
	}
}

@media (max-width: 600px) {
	.user-info {
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.active-game {
		padding: 0.25rem;
		gap: 0.5rem;
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
