<template>
	<div class="container">
		<div class="page-header">
			<h1>
				<img src="/PicaPic Logo small.png" alt="PicaPic" class="page-logo" />
				<span class="page-title-text">{{ t.picapic.title }}</span>
			</h1>
			<div class="language-dropdown">
				<button
					class="btn-lang"
					@click="toggleLanguageMenu"
					:aria-label="t.landing?.languageLabel || 'Language'"
					ref="langButton"
				>
					{{ locale.toUpperCase() }}
				</button>
				<Teleport to="body">
					<div
						v-if="isShowLanguageMenu"
						class="language-menu"
						:style="menuPosition"
					>
						<button
							v-for="option in languageOptions"
							:key="option.value"
							class="language-option"
							:class="{ active: locale === option.value }"
							@click="selectLanguage(option.value)"
						>
							{{ option.label }}
						</button>
					</div>
				</Teleport>
			</div>
		</div>

		<div class="content">
			<p v-if="!hasSelected">{{ t.picapic.instructions }}</p>

			<div class="score-section">
				<div class="score-item">
					<span class="score-label">{{ t.picapic.score }}:</span>
					<span class="score-value">{{ score }}</span>
				</div>
				<div class="score-item">
					<span class="score-label">{{ t.picapic.trials }}:</span>
					<span class="score-value">{{ numTrials }}</span>
				</div>
			</div>

			<div class="images-section">
				<div v-if="error" class="error-message">
					{{ error }}
				</div>

				<div v-if="isLoading" class="loading">
					{{ t.picapic.loadingImages }}
				</div>

				<div v-else class="image-grid">
					<div
						v-for="image in images"
						:key="image.publicId"
						class="image-card"
						:class="{
							selected: selectedImageId === image.publicId,
							revealed: hasSelected,
							winner: hasSelected && isWinningImage(image.publicId),
							clickable: !hasSelected,
						}"
						@click="selectImage(image.publicId)"
					>
						<img :src="image.url" :alt="image.publicId" loading="lazy" />
						<div class="image-name">{{ image.query }}</div>
						<div v-if="hasSelected" class="selection-count">
							<span class="count-number">{{
								selectionCounts[image.publicId] || 0
							}}</span>
							<span class="count-label">{{ t.picapic.selections }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Result Modal -->
		<Teleport to="body">
			<div
				v-if="isShowingResultModal"
				class="modal-overlay"
				@click.self="dismissModal"
			>
				<div class="result-modal">
					<div v-if="selectedRank === 1" class="modal-message winner">
						🎉 {{ t.picapic.youWon }}
					</div>
					<div v-else class="modal-message">
						{{ t.picapic.youSelected }} #{{ selectedRank }}
					</div>
					<div
						class="points-message"
						:class="{ positive: pointsEarned > 0, negative: pointsEarned < 0 }"
					>
						<span v-if="pointsEarned > 0"
							>+{{ pointsEarned }}
							{{
								Math.abs(pointsEarned) === 1
									? t.picapic.point
									: t.picapic.points
							}}</span
						>
						<span v-else-if="pointsEarned < 0"
							>{{ pointsEarned }}
							{{
								Math.abs(pointsEarned) === 1
									? t.picapic.point
									: t.picapic.points
							}}</span
						>
					</div>
					<div class="modal-countdown">
						<div
							class="countdown-bar"
							:style="{ width: countdownProgress + '%' }"
						></div>
					</div>
					<button class="modal-ok-btn" @click="dismissModal">OK</button>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useI18n } from '~/composables/useI18n';
import { en } from '~/i18n';

const { t, locale, setLocale } = useI18n();
const { isAuthenticated, getAuthHeader } = useAuth();

definePageMeta({
	ssr: false,
});

// Language dropdown
type LocaleKey = keyof typeof en.languages;
const supportedLocales = Object.keys(en.languages) as LocaleKey[];

const languageOptions = computed(() =>
	supportedLocales.map((code) => ({
		value: code,
		label: t.value.languages?.[code] ?? en.languages[code] ?? code,
	}))
);

const isShowLanguageMenu = ref(false);
const langButton = ref<HTMLElement | null>(null);
const menuPosition = ref({});

function toggleLanguageMenu() {
	isShowLanguageMenu.value = !isShowLanguageMenu.value;

	if (isShowLanguageMenu.value && langButton.value) {
		nextTick(() => {
			const rect = langButton.value!.getBoundingClientRect();
			menuPosition.value = {
				position: 'fixed',
				top: `${rect.bottom + 8}px`,
				right: `${window.innerWidth - rect.right}px`,
				zIndex: 999999,
			};
		});
	}
}

function selectLanguage(lang: string) {
	setLocale(lang, true);
	isShowLanguageMenu.value = false;
}

function handleClickOutside(event: MouseEvent) {
	const target = event.target as HTMLElement;
	if (!target.closest('.language-dropdown')) {
		isShowLanguageMenu.value = false;
	}
}

interface CloudinaryImage {
	url: string;
	publicId: string;
	query: string;
	width: number;
	height: number;
	format: string;
}

const STORAGE_KEY_SCORE = 'picapic_score';
const STORAGE_KEY_TRIALS = 'picapic_trials';

const images = ref<CloudinaryImage[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const selectedImageId = ref<string | null>(null);
const selectionCounts = ref<Record<string, number>>({});
const hasSelected = ref(false);
const selectedRank = ref(0);

// Modal state
const isShowingResultModal = ref(false);
const countdownProgress = ref(100);
const pointsEarned = ref(0);
let modalTimeoutId: ReturnType<typeof setTimeout> | null = null;
let countdownIntervalId: ReturnType<typeof setInterval> | null = null;

// Score tracking (starts at 400)
const score = ref(400);
const numTrials = ref(0);

// Load score from server (if authenticated) or localStorage
async function loadScore() {
	if (typeof window === 'undefined') return;

	// First load from localStorage for immediate display
	const storedScore = localStorage.getItem(STORAGE_KEY_SCORE);
	const storedTrials = localStorage.getItem(STORAGE_KEY_TRIALS);
	score.value = storedScore ? parseInt(storedScore, 10) : 400;
	numTrials.value = storedTrials ? parseInt(storedTrials, 10) : 0;

	// If authenticated, fetch from server and use that as source of truth
	if (isAuthenticated.value) {
		try {
			const headers = getAuthHeader();
			if (headers) {
				const userData = await $fetch<{
					picapicScore: number;
					picapicTrials: number;
				}>('/api/user', { headers });
				score.value = userData.picapicScore ?? 400;
				numTrials.value = userData.picapicTrials ?? 0;
				// Sync localStorage with server values
				localStorage.setItem(STORAGE_KEY_SCORE, score.value.toString());
				localStorage.setItem(STORAGE_KEY_TRIALS, numTrials.value.toString());
			}
		} catch (err) {
			console.error('Failed to fetch user score:', err);
			// Fall back to localStorage values already loaded
		}
	}
}

// Save score to server (if authenticated) and localStorage
async function saveScore() {
	if (typeof window === 'undefined') return;

	// Always save to localStorage
	localStorage.setItem(STORAGE_KEY_SCORE, score.value.toString());
	localStorage.setItem(STORAGE_KEY_TRIALS, numTrials.value.toString());

	// If authenticated, also persist to server
	if (isAuthenticated.value) {
		try {
			const headers = getAuthHeader();
			if (headers) {
				await $fetch('/api/picapic-score', {
					method: 'POST',
					headers,
					body: {
						picapicScore: score.value,
						picapicTrials: numTrials.value,
					},
				});
			}
		} catch (err) {
			console.error('Failed to save score to server:', err);
		}
	}
}

// Get the winning image (most selected)
function getWinningImageId() {
	let maxCount = -1;
	let winningId = '';
	for (const [id, count] of Object.entries(selectionCounts.value)) {
		if (count > maxCount) {
			maxCount = count;
			winningId = id;
		}
	}
	return winningId;
}

function isWinningImage(publicId: string) {
	return publicId === getWinningImageId();
}

// Calculate rank of selected image (1 = most selected)
function calculateRank(publicId: string): number {
	const counts = Object.entries(selectionCounts.value)
		.map(([id, count]) => ({ id, count }))
		.sort((a, b) => b.count - a.count);

	const rank = counts.findIndex((item) => item.id === publicId) + 1;
	return rank;
}

// Calculate points based on rank: [2, 1, -1, -2] for ranks 1-4
function calculatePoints(rank: number): number {
	const pointsByRank = [2, 1, -1, -2];
	return pointsByRank[rank - 1] ?? 0;
}

function showConfetti() {
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

function dismissModal() {
	// Clear any existing timers
	if (modalTimeoutId) {
		clearTimeout(modalTimeoutId);
		modalTimeoutId = null;
	}
	if (countdownIntervalId) {
		clearInterval(countdownIntervalId);
		countdownIntervalId = null;
	}

	isShowingResultModal.value = false;
	countdownProgress.value = 100;
	fetchImages();
}

function showModal() {
	isShowingResultModal.value = true;
	countdownProgress.value = 100;

	const MODAL_DURATION = 4000;
	const UPDATE_INTERVAL = 50;
	const steps = MODAL_DURATION / UPDATE_INTERVAL;
	const decrementPerStep = 100 / steps;

	// Start countdown animation
	countdownIntervalId = setInterval(() => {
		countdownProgress.value = Math.max(
			0,
			countdownProgress.value - decrementPerStep
		);
	}, UPDATE_INTERVAL);

	// Auto-dismiss after 4 seconds
	modalTimeoutId = setTimeout(() => {
		dismissModal();
	}, MODAL_DURATION);
}

async function selectImage(publicId: string) {
	if (hasSelected.value || isLoading.value) return;

	selectedImageId.value = publicId;

	try {
		// Persist the selection
		await $fetch('/api/image-selection', {
			method: 'POST',
			body: { publicId },
		});

		// Fetch all selection counts
		const publicIds = images.value.map((img) => img.publicId).join(',');
		const response = await $fetch<{ counts: Record<string, number> }>(
			`/api/image-selection?publicIds=${encodeURIComponent(publicIds)}`
		);
		selectionCounts.value = response.counts;

		hasSelected.value = true;

		// Calculate rank and points
		selectedRank.value = calculateRank(publicId);
		const points = calculatePoints(selectedRank.value);
		pointsEarned.value = points;

		// Update score (ensure never goes negative)
		score.value = Math.max(0, score.value + points);
		numTrials.value += 1;
		saveScore();

		// Show confetti if won (selected most popular)
		if (selectedRank.value === 1) {
			showConfetti();
		}

		// Show result modal
		showModal();
	} catch (err: any) {
		error.value = err.message || 'Failed to record selection';
		console.error('Error selecting image:', err);
	}
}

async function fetchImages() {
	isLoading.value = true;
	error.value = null;
	hasSelected.value = false;
	selectedImageId.value = null;
	selectionCounts.value = {};
	selectedRank.value = 0;

	try {
		const response = await $fetch<{ images: CloudinaryImage[] }>(
			'/api/cloudinary-images'
		);
		images.value = response.images;
	} catch (err: any) {
		error.value = err.message || 'Failed to load images';
		console.error('Error fetching images:', err);
	} finally {
		isLoading.value = false;
	}
}

// Fetch images on mount
onMounted(() => {
	loadScore();
	fetchImages();
	document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
	if (modalTimeoutId) {
		clearTimeout(modalTimeoutId);
	}
	if (countdownIntervalId) {
		clearInterval(countdownIntervalId);
	}
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

.page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.25rem;
	padding-bottom: 0.5rem;
	flex-wrap: wrap;
	gap: 1rem;
	position: relative;
}

.page-header h1 {
	margin: 0;
	color: #333;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 2.5rem;
}

.page-logo {
	height: 80px;
	width: auto;
}

.page-title-text {
	font-size: inherit;
	font-weight: 600;
	/* color: #f0ad4e; */
	/* font-family: 'Courier New', Courier, monospace; */
	letter-spacing: 4px;
	-webkit-text-stroke: 6px #4a9d4a;
	paint-order: stroke fill;
}

.btn-back {
	padding: 0.5rem 1rem;
	border: 1px solid #5cb85c;
	color: #fff;
	border-radius: 4px;
	font-size: 0.9rem;
	font-weight: 500;
	text-decoration: none;
	background: #5cb85c;
	transition: all 0.2s ease;
}

.btn-back:hover {
	background: #4a9d4a;
	border-color: #4a9d4a;
}

.content {
	background: #fff;
	border-radius: 16px;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
	padding: 2rem;
	text-align: center;
}

.content p {
	font-size: 1.25rem;
	color: #666;
	margin: 0;
}

.images-section {
	margin-top: 2rem;
}

.images-section h2 {
	color: #333;
	margin-bottom: 1rem;
}

.refresh-btn {
	padding: 0.75rem 1.5rem;
	background: #5cb85c;
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	cursor: pointer;
	transition: background 0.2s ease;
	margin-bottom: 1.5rem;
}

.refresh-btn:hover:not(:disabled) {
	background: #4a9d4a;
}

.refresh-btn:disabled {
	background: #ccc;
	cursor: not-allowed;
}

.loading {
	color: #666;
	font-size: 1.1rem;
	padding: 2rem;
}

.error-message {
	color: #d9534f;
	background: #fdf2f2;
	padding: 1rem;
	border-radius: 8px;
	margin-bottom: 1rem;
}

.image-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1.5rem;
	margin-top: 1rem;
}

.image-card {
	background: #f9f9f9;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
	position: relative;
	border: 3px solid transparent;
}

.image-card.clickable {
	cursor: pointer;
}

.image-card.clickable:hover {
	transform: translateY(-4px);
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.image-card.revealed {
	opacity: 0.7;
}

.image-card.selected {
	border-color: #5cb85c;
	opacity: 1;
}

.image-card.winner {
	border-color: #f0ad4e;
	opacity: 1;
	box-shadow: 0 0 20px rgba(240, 173, 78, 0.5);
}

.image-card.selected.winner {
	border-color: #5cb85c;
	box-shadow: 0 0 20px rgba(92, 184, 92, 0.5);
}

.image-card img {
	width: 100%;
	aspect-ratio: 1 / 1;
	object-fit: contain;
	display: block;
	background: #f0f0f0;
}

.image-name {
	font-size: 0.75rem;
	color: #666;
	padding: 0.25rem 0.5rem;
	text-align: center;
	background: #f5f5f5;
}

.selection-count {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.75);
	color: white;
	padding: 0.75rem;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.count-number {
	font-size: 1.5rem;
	font-weight: bold;
}

.count-label {
	font-size: 0.8rem;
	opacity: 0.9;
}

.image-id {
	padding: 0.75rem;
	font-size: 0.85rem;
	color: #666;
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.result-message {
	font-size: 1.5rem;
	font-weight: 600;
	margin-bottom: 1rem;
}

.result-message.winner {
	color: #5cb85c;
}

.score-section {
	display: flex;
	justify-content: center;
	gap: 2rem;
	margin: 1.5rem 0;
	padding: 1rem;
	background: #f5f5f5;
	border-radius: 12px;
}

.score-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.score-label {
	font-size: 0.9rem;
	color: #666;
}

.score-label-small {
	margin-left: 8px;
	font-size: 0.9rem;
	color: #666;
}

.score-value-row {
	display: flex;
	align-items: baseline;
	justify-content: center;
}

.score-value {
	font-size: 1.75rem;
	font-weight: bold;
	color: #333;
}

@media (max-width: 768px) {
	.page-header {
		justify-content: center;
	}

	.page-header h1 {
		flex-basis: 100%;
		justify-content: center;
		text-align: center;
		font-size: 2rem;
	}

	.page-logo {
		height: 52px;
		border-radius: 8px;
	}
}

@media (max-width: 600px) {
	.container {
		padding: 0.5rem;
	}

	.content {
		padding: 1rem;
	}

	.image-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.selection-count {
		padding: 0.5rem;
	}

	.count-number {
		font-size: 1.1rem;
	}

	.count-label {
		font-size: 0.7rem;
	}
}

/* Language dropdown styles */
.language-dropdown {
	position: absolute;
	right: 0;
	top: 0;
	z-index: 100000;
}

.btn-lang {
	padding: 0.45rem 0.75rem;
	border: 1px solid rgba(0, 0, 0, 0.2);
	color: #333;
	border-radius: 999px;
	font-size: 0.75rem;
	font-weight: 600;
	text-decoration: none;
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10px);
	transition: all 0.2s ease;
	cursor: pointer;
	white-space: nowrap;
	display: flex;
	align-items: center;
	gap: 0.35rem;
}

.btn-lang::before {
	content: '';
	width: 18px;
	height: 18px;
	display: inline-block;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333333' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E");
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}

.btn-lang:hover {
	background: rgba(0, 0, 0, 0.1);
	transform: scale(1.05);
}

.language-menu {
	background: rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(20px);
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	overflow: hidden;
	min-width: 140px;
	animation: slideDownMenu 0.2s ease-out;
	pointer-events: auto;
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

.language-option {
	width: 100%;
	padding: 0.75rem 1rem;
	border: none;
	background: transparent;
	color: #0f1115;
	font-size: 0.875rem;
	font-weight: 500;
	text-align: left;
	cursor: pointer;
	transition: background 0.2s ease;
}

.language-option:hover {
	background: rgba(116, 214, 109, 0.15);
}

.language-option.active {
	background: rgba(116, 214, 109, 0.25);
	font-weight: 600;
}

/* Result Modal styles */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: transparent;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	pointer-events: none;
	z-index: 1000000;
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

.result-modal {
	background: white;
	border-radius: 12px;
	padding: 1rem 1.5rem;
	min-width: 250px;
	max-width: 90%;
	text-align: center;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
	margin-top: 120px;
	pointer-events: auto;
	animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.modal-message {
	font-size: 1.25rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 0.75rem;
}

.modal-message.winner {
	color: #5cb85c;
	font-size: 1.35rem;
}

.points-message {
	font-size: 1.1rem;
	font-weight: 600;
	margin-bottom: 0.75rem;
}

.points-message.positive {
	color: #5cb85c;
}

.points-message.negative {
	color: #d9534f;
}

.modal-countdown {
	height: 4px;
	background: #e0e0e0;
	border-radius: 2px;
	margin-bottom: 0.75rem;
	overflow: hidden;
}

.countdown-bar {
	height: 100%;
	background: #5cb85c;
	border-radius: 2px;
	transition: width 0.05s linear;
}

.modal-ok-btn {
	padding: 0.5rem 1.5rem;
	background: #5cb85c;
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s ease, transform 0.1s ease;
}

.modal-ok-btn:hover {
	background: #4a9d4a;
}

.modal-ok-btn:active {
	transform: scale(0.98);
}
</style>
