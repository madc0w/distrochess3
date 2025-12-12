<template>
	<div class="container">
		<div class="page-header">
			<h1>
				<img src="/PopIt Logo small.png" alt="PopIt" class="page-logo" />
				<span class="page-title-text">{{ t.popit.title }}</span>
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
			<p v-if="!hasSelected">{{ t.popit.instructions }}</p>
			<p v-else-if="selectedRank === 1" class="result-message winner">
				🎉 {{ t.popit.youWon }}
			</p>
			<p v-else class="result-message">
				{{ t.popit.youSelected }} #{{ selectedRank }}
			</p>

			<div class="score-section">
				<div class="score-item">
					<span class="score-label">{{ t.popit.averageScore }}:</span>
					<span class="score-value">{{ Math.round(100 * averageScore) }}</span>
				</div>
				<div class="score-item">
					<span class="score-label">{{ t.popit.trials }}:</span>
					<span class="score-value">{{ numTrials }}</span>
				</div>
			</div>

			<div class="images-section">
				<!-- 
                <button @click="fetchImages" class="refresh-btn" :disabled="loading">
					{{
						loading
							? t.popit.loading
							: hasSelected
							? t.popit.playAgain
							: t.popit.refreshImages
					}}
				</button> -->

				<div v-if="error" class="error-message">
					{{ error }}
				</div>

				<div v-if="isLoading" class="loading">
					{{ t.popit.loadingImages }}
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
						<div class="image-name">{{ formatImageName(image.query) }}</div>
						<div v-if="hasSelected" class="selection-count">
							<span class="count-number">{{
								selectionCounts[image.publicId] || 0
							}}</span>
							<span class="count-label">{{ t.popit.selections }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from '~/composables/useI18n';
import { en } from '~/i18n';

const { t, locale, setLocale } = useI18n();

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

const toggleLanguageMenu = () => {
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
};

const selectLanguage = (lang: string) => {
	setLocale(lang, true);
	isShowLanguageMenu.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	if (!target.closest('.language-dropdown')) {
		isShowLanguageMenu.value = false;
	}
};

interface CloudinaryImage {
	url: string;
	publicId: string;
	query: string;
	width: number;
	height: number;
	format: string;
}

const STORAGE_KEY_SCORE = 'popit_total_score';
const STORAGE_KEY_TRIALS = 'popit_num_trials';

const images = ref<CloudinaryImage[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const selectedImageId = ref<string | null>(null);
const selectionCounts = ref<Record<string, number>>({});
const hasSelected = ref(false);
const selectedRank = ref(0);

// Score tracking
const totalScore = ref(0);
const numTrials = ref(0);

const averageScore = computed(() => {
	if (numTrials.value === 0) return 0;
	return totalScore.value / numTrials.value;
});

// Load scores from localStorage on mount
function loadScores() {
	if (typeof window !== 'undefined') {
		const storedScore = localStorage.getItem(STORAGE_KEY_SCORE);
		const storedTrials = localStorage.getItem(STORAGE_KEY_TRIALS);
		totalScore.value = storedScore ? parseInt(storedScore, 10) : 0;
		numTrials.value = storedTrials ? parseInt(storedTrials, 10) : 0;
	}
}

// Save scores to localStorage
function saveScores() {
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY_SCORE, totalScore.value.toString());
		localStorage.setItem(STORAGE_KEY_TRIALS, numTrials.value.toString());
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

// Format image name: strip trailing number and replace underscores with spaces
function formatImageName(publicId: string): string {
	// Get just the filename part (after last /)
	const filename = publicId.split('/').pop() || publicId;
	// Remove trailing underscore and number (e.g., "_02" or "_123")
	const withoutNumber = filename.replace(/(_\d+)+$/, '');
	// Replace underscores with spaces
	return withoutNumber.replace(/_/g, ' ');
}

// Calculate rank of selected image (1 = most selected)
function calculateRank(publicId: string): number {
	const counts = Object.entries(selectionCounts.value)
		.map(([id, count]) => ({ id, count }))
		.sort((a, b) => b.count - a.count);

	const rank = counts.findIndex((item) => item.id === publicId) + 1;
	return rank;
}

// Calculate points based on rank
function calculatePoints(rank: number): number {
	const n = images.value.length;
	return Math.max(0, n - rank + 1);
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

		// Update scores
		totalScore.value += points;
		numTrials.value += 1;
		saveScores();

		// Show confetti if won (selected most popular)
		if (selectedRank.value === 1) {
			showConfetti();
		}

		// Auto-reload after 2 seconds
		setTimeout(() => {
			fetchImages();
		}, 2000);
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
	loadScores();
	fetchImages();
	document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
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
	border-bottom: 2px solid #eee;
	flex-wrap: wrap;
	gap: 1rem;
}

.page-header h1 {
	margin: 0;
	color: #333;
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.page-logo {
	height: 48px;
	width: auto;
	border-radius: 8px;
}

.page-title-text {
	font-size: 1.75rem;
	font-weight: 600;
	color: inherit;
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
	}

	.page-title-text {
		font-size: 1.25rem;
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
	position: relative;
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
</style>
