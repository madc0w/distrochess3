<template>
	<div class="auth-page" v-cloak>
		<div class="gradient"></div>
		<AuthForm mode="signup" />
	</div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import AuthForm from '~/components/AuthForm.vue';
import { useAuth } from '~/composables/useAuth';
import { useEscapeKey } from '~/composables/useEscapeKey';

definePageMeta({
	ssr: false,
});

const router = useRouter();
const { isAuthenticated } = useAuth();

useEscapeKey(() => {
	router.replace('/');
});

watchEffect(() => {
	if (isAuthenticated.value) {
		router.replace('/');
	}
});
</script>

<style scoped>
.auth-page {
	position: relative;
	min-height: 100vh;
	background: #0f1115;
	color: #fff;
	overflow: hidden;
}

.gradient {
	position: absolute;
	inset: 0;
	background: radial-gradient(
			circle at 80% 20%,
			rgba(72, 187, 120, 0.45),
			transparent 55%
		),
		radial-gradient(circle at 10% 0%, rgba(252, 211, 77, 0.35), transparent 55%),
		linear-gradient(
			135deg,
			rgba(13, 17, 23, 0.95) 0%,
			rgba(13, 17, 23, 0.8) 70%
		);
	filter: blur(0px);
	z-index: 0;
}

.auth-page :deep(.auth-shell) {
	position: relative;
	z-index: 1;
}
</style>
