<script setup lang="ts">
import { ref } from 'vue';

const games = ref<any[]>([]);
const loading = ref(true);

async function load() {
	loading.value = true;
	const { data } = await useFetch('/api/games');
	games.value = data.value || [];
	loading.value = false;
}

await load();

const white = ref('White');
const black = ref('Black');

async function createGame() {
	await $fetch('/api/games', {
		method: 'POST',
		body: { white: white.value, black: black.value },
	});
	white.value = '';
	black.value = '';
	await load();
}
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold mb-4">DistroChess — Games</h1>
		<form @submit.prevent="createGame" class="mb-4">
			<input v-model="white" placeholder="White" />
			<input v-model="black" placeholder="Black" />
			<button type="submit">Create</button>
		</form>

		<div v-if="loading">Loading...</div>
		<ul v-else>
			<li v-for="g in games" :key="g._id">
				{{ g.white }} vs {{ g.black }} —
				{{ new Date(g.createdAt).toLocaleString() }}
			</li>
		</ul>
	</div>
</template>
