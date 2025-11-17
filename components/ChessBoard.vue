<script setup lang="ts">
// Simple placeholder chessboard component
</script>

<template>
	<div
		style="
			width: 320px;
			height: 320px;
			border: 1px solid #ccc;
			display: grid;
			grid-template-columns: repeat(8, 1fr);
		"
	>
		<div
			v-for="n in 64"
			:key="n"
			:style="{
				background:
					(Math.floor((n - 1) / 8) + ((n - 1) % 8)) % 2 === 0
						? '#f0d9b5'
						: '#b58863',
				width: '40px',
				height: '40px',
			}"
		></div>
	</div>
</template>
