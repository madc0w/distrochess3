<template>
	<div class="container" v-cloak>
		<div class="leaderboard-page">
			<header class="leaderboard-topbar">
				<NuxtLink to="/" class="logo">{{ t.distroChess }}</NuxtLink>
				<nav class="top-links">
					<NuxtLink v-if="isAuthenticated" to="/game" class="ghost-link">
						{{ t.leaderboard.backToGame }}
					</NuxtLink>
					<NuxtLink v-else to="/" class="ghost-link">
						{{ t.leaderboard.backToHome }}
					</NuxtLink>
				</nav>
			</header>

			<div class="page-header">
				<h1>{{ t.leaderboard.title }}</h1>
				<p class="subtitle">{{ t.leaderboard.subtitle }}</p>
			</div>

			<div v-if="isLoading" class="loading-state">
				<div class="loading-spinner"></div>
				<p>{{ t.leaderboard.loading }}</p>
			</div>

			<div v-else-if="errorMessage" class="error-state">
				<p>{{ errorMessage }}</p>
			</div>

			<div v-else-if="players.length" class="leaderboard-table">
				<table>
					<thead>
						<tr>
							<th class="rank-col">{{ t.leaderboard.rank }}</th>
							<th class="name-col">{{ t.leaderboard.player }}</th>
							<th class="score-col">{{ t.leaderboard.score }}</th>
							<th class="stat-col">{{ t.leaderboard.wins }}</th>
							<th class="stat-col">{{ t.leaderboard.losses }}</th>
							<th class="stat-col">{{ t.leaderboard.draws }}</th>
							<th class="date-col">{{ t.leaderboard.memberSince }}</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(player, index) in players"
							:key="player._id"
							:class="{ 'current-user': player._id === user?._id }"
						>
							<td class="rank-col">
								<span class="rank-badge" :class="`rank-${index + 1}`">
									<span v-if="index === 0">🏆</span>
									<span v-else-if="index === 1">🥈</span>
									<span v-else-if="index === 2">🥉</span>
									<span v-else>{{ index + 1 }}</span>
								</span>
							</td>
							<td class="name-col">
								{{ player.name }}
								<span v-if="player._id === user?._id" class="you-tag">
									{{ t.leaderboard.you }}
								</span>
							</td>
							<td class="score-col">
								{{ Math.round(player.score) }}
							</td>
							<td class="stat-col">
								{{ player.wins }}
							</td>
							<td class="stat-col">
								{{ player.losses }}
							</td>
							<td class="stat-col">
								{{ player.draws }}
							</td>
							<td class="date-col">
								{{ formatMemberSince(player.createdDate, timeAgoTranslations) }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div v-else class="empty-state">
				<p>{{ t.leaderboard.noPlayers }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth();
import { computed, onMounted, ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useI18n } from '~/composables/useI18n';
import { translateServerError } from '~/composables/useServerErrors';
import { formatMemberSince } from '~/utils/formatDate';

definePageMeta({
	ssr: false,
});

const { t } = useI18n();

const timeAgoTranslations = computed(() => ({
	today: t.value.leaderboard.timeAgo.today,
	day:
		typeof t.value.leaderboard.timeAgo.day === 'function'
			? t.value.leaderboard.timeAgo.day()
			: t.value.leaderboard.timeAgo.day,
	days:
		typeof t.value.leaderboard.timeAgo.days === 'function'
			? t.value.leaderboard.timeAgo.days()
			: t.value.leaderboard.timeAgo.days,
	month:
		typeof t.value.leaderboard.timeAgo.month === 'function'
			? t.value.leaderboard.timeAgo.month()
			: t.value.leaderboard.timeAgo.month,
	months:
		typeof t.value.leaderboard.timeAgo.months === 'function'
			? t.value.leaderboard.timeAgo.months()
			: t.value.leaderboard.timeAgo.months,
	year:
		typeof t.value.leaderboard.timeAgo.year === 'function'
			? t.value.leaderboard.timeAgo.year()
			: t.value.leaderboard.timeAgo.year,
	years:
		typeof t.value.leaderboard.timeAgo.years === 'function'
			? t.value.leaderboard.timeAgo.years()
			: t.value.leaderboard.timeAgo.years,
}));
const { user, getAuthHeader } = useAuth();

type Player = {
	_id: string;
	name: string;
	score: number;
	createdDate: Date | string | null;
	wins: number;
	losses: number;
	draws: number;
};

const players = ref<Player[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');

async function fetchLeaderboard() {
	// console.log('[Client] Starting fetchLeaderboard...');
	isLoading.value = true;
	errorMessage.value = '';

	try {
		// console.log('[Client] Calling $fetch...');
		const response = await $fetch<Player[]>('/api/leaderboard');

		// console.log('[Client] Got response:', response);
		players.value = response;
		// console.log('[Client] Players set:', players.value);
	} catch (err: any) {
		// console.error('[Client] Failed to fetch leaderboard:', err);
		errorMessage.value =
			translateServerError(err, t.value) || t.value.errors.ERR_GENERIC;
	} finally {
		// console.log('[Client] Setting isLoading to false');
		isLoading.value = false;
		// console.log('[Client] isLoading is now:', isLoading.value);
	}
}

onMounted(() => {
	fetchLeaderboard();
});
</script>

<style scoped>
.container {
	max-width: 900px;
	margin: 0 auto;
	padding: 1.5rem;
	min-height: 100vh;
}

.leaderboard-page {
	padding: 0;
	position: relative;
}

.leaderboard-topbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	margin-bottom: 2rem;
}

.logo {
	font-size: 1.15rem;
	font-weight: 700;
	text-decoration: none;
	color: #111;
}

.top-links {
	display: flex;
	gap: 0.75rem;
	flex-wrap: wrap;
	justify-content: flex-end;
}

.ghost-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	text-decoration: none;
	color: #0f172a;
	background: rgba(15, 23, 42, 0.06);
	font-weight: 500;
	padding: 0.65rem 1.35rem;
	border-radius: 999px;
	border: 1px solid rgba(15, 23, 42, 0.15);
	transition: background 0.2s ease, transform 0.15s ease;
}

.ghost-link:hover {
	background: rgba(15, 23, 42, 0.1);
	transform: translateY(-1px);
}

.page-header {
	text-align: center;
	margin-bottom: 2rem;
	padding-bottom: 1.5rem;
	border-bottom: 2px solid #eee;
}

.page-header h1 {
	margin: 0 0 0.5rem;
	font-size: 2.5rem;
	color: #333;
}

.subtitle {
	margin: 0;
	color: #666;
	font-size: 1.1rem;
}

.loading-state,
.error-state,
.empty-state {
	text-align: center;
	padding: 3rem 1.5rem;
}

.loading-spinner {
	width: 40px;
	height: 40px;
	border: 4px solid #f3f3f3;
	border-top: 4px solid #74d66d;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin: 0 auto 1.5rem;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.loading-state p,
.empty-state p {
	font-size: 1.25rem;
	color: #666;
}

.error-state p {
	font-size: 1.1rem;
	color: #d32f2f;
	background: #ffebee;
	padding: 1rem;
	border: 1px solid #ef9a9a;
}

.leaderboard-table {
	background: white;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	border: 1px solid #000;
}

table {
	width: 100%;
	border-collapse: collapse;
}

thead {
	background: #e8e8e8;
}

th {
	padding: 1rem;
	text-align: left;
	font-weight: 600;
	color: #333;
	border-bottom: 2px solid #000;
	border-right: 1px solid #000;
}

th:last-child {
	border-right: none;
}

.rank-col {
	width: 80px;
	text-align: center;
}

.score-col {
	width: 120px;
	text-align: center;
}

.stat-col {
	width: 80px;
	text-align: center;
}

.date-col {
	width: 180px;
	text-align: center;
}

.name-col {
	text-align: left;
}

tbody tr {
	background: #e8e8e8;
	border-bottom: 1px solid #000;
	transition: background 0.2s;
}

tbody tr:hover {
	background: #d3d3d3;
}

tbody tr.current-user {
	background: #e8f5e9;
}

tbody tr.current-user:hover {
	background: #c8e6c9;
}

td {
	padding: 1rem;
	border-right: 1px solid #000;
}

td:last-child {
	border-right: none;
}

.rank-badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	background: #e0e0e0;
	color: #333;
	border-radius: 50%;
	font-weight: 700;
	font-size: 1.1rem;
}

tbody tr:nth-child(1) .rank-badge {
	background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
	box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
	font-size: 1.5rem;
}

tbody tr:nth-child(2) .rank-badge {
	background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
	box-shadow: 0 2px 8px rgba(192, 192, 192, 0.5);
	font-size: 1.4rem;
}

tbody tr:nth-child(3) .rank-badge {
	background: linear-gradient(135deg, #cd7f32 0%, #e89a5e 100%);
	box-shadow: 0 2px 8px rgba(205, 127, 50, 0.5);
	font-size: 1.3rem;
}

.you-tag {
	display: inline-block;
	margin-left: 0.5rem;
	padding: 0.15rem 0.5rem;
	background: #74d66d;
	color: white;
	border-radius: 12px;
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
}

@media (max-width: 600px) {
	.container {
		padding: 1rem;
	}

	.leaderboard-topbar {
		flex-direction: column;
		align-items: flex-start;
	}

	.top-links {
		justify-content: flex-start;
	}

	.page-header h1 {
		font-size: 1.5rem;
	}

	.subtitle {
		font-size: 0.9rem;
	}

	th,
	td {
		padding: 0.5rem 0.25rem;
		font-size: 0.75rem;
	}

	.rank-col {
		width: 50px;
	}

	.score-col {
		width: 60px;
	}

	.stat-col {
		width: 50px;
	}

	.date-col {
		width: 100px;
		font-size: 0.7rem;
	}

	.name-col {
		font-size: 0.8rem;
	}

	.rank-badge {
		width: 28px;
		height: 28px;
		font-size: 0.75rem;
	}

	tbody tr:nth-child(1) .rank-badge {
		font-size: 1rem;
	}

	tbody tr:nth-child(2) .rank-badge {
		font-size: 0.95rem;
	}

	tbody tr:nth-child(3) .rank-badge {
		font-size: 0.9rem;
	}

	.you-tag {
		font-size: 0.65rem;
		padding: 0.1rem 0.4rem;
	}
}
</style>
