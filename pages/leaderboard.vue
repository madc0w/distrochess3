<template>
	<div class="container" v-cloak>
		<div class="leaderboard-page">
			<div class="page-header">
				<h1>{{ t.leaderboard.title }}</h1>
				<p class="subtitle">{{ t.leaderboard.subtitle }}</p>
			</div>

			<div class="nav-links">
				<NuxtLink to="/game" class="btn-link">
					{{ t.leaderboard.backToGame }}
				</NuxtLink>
				<NuxtLink to="/" class="btn-link">
					{{ t.leaderboard.backToHome }}
				</NuxtLink>
			</div>

			<div v-if="isLoading" class="loading-state">
				<div class="loading-spinner"></div>
				<p>{{ t.leaderboard.loading }}</p>
			</div>

			<div v-else-if="errorMessage" class="error-state">
				<p>{{ errorMessage }}</p>
			</div>

			<div v-else-if="!players.length" class="empty-state">
				<p>{{ t.leaderboard.noPlayers }}</p>
			</div>

			<div v-else class="leaderboard-table">
				<table>
					<thead>
						<tr>
							<th class="rank-col">{{ t.leaderboard.rank }}</th>
							<th class="name-col">{{ t.leaderboard.player }}</th>
							<th class="score-col">{{ t.leaderboard.score }}</th>
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
							<td class="date-col">
								{{
									formatMemberSince(player.createdDate, user?.preferredLocale)
								}}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useI18n } from '~/composables/useI18n';
import { translateServerError } from '~/composables/useServerErrors';
import { formatMemberSince } from '~/utils/formatDate';

definePageMeta({
	ssr: false,
});

const { t } = useI18n();
const { user, getAuthHeader } = useAuth();

type Player = {
	_id: string;
	name: string;
	score: number;
	createdDate: Date | string | null;
};

const players = ref<Player[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');

async function fetchLeaderboard() {
	isLoading.value = true;
	errorMessage.value = '';

	try {
		const authHeaders = getAuthHeader();
		const response = await $fetch<Player[]>('/api/leaderboard', {
			...(authHeaders ? { headers: authHeaders } : {}),
		});

		players.value = response;
	} catch (err: any) {
		errorMessage.value =
			translateServerError(err, t.value) || t.value.errors.ERR_GENERIC;
	} finally {
		isLoading.value = false;
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
	padding: 1rem 0;
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

.nav-links {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-bottom: 2rem;
	flex-wrap: wrap;
}

.btn-link {
	padding: 0.6rem 1.25rem;
	border: 1px solid #74d66d;
	color: #74d66d;
	text-decoration: none;
	font-size: 0.95rem;
	transition: all 0.2s;
}

.btn-link:hover {
	background: #74d66d;
	color: white;
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

	.page-header h1 {
		font-size: 2rem;
	}

	.subtitle {
		font-size: 1rem;
	}

	th,
	td {
		padding: 0.75rem 0.5rem;
	}

	.rank-col {
		width: 60px;
	}

	.score-col {
		width: 80px;
	}

	.date-col {
		width: 140px;
		font-size: 0.85rem;
	}

	.rank-badge {
		width: 32px;
		height: 32px;
		font-size: 0.85rem;
	}
}
</style>
