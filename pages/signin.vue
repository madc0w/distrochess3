<template>
	<div class="auth-page" v-cloak>
		<div class="gradient"></div>
		<AuthForm mode="signin" :redirect-to="redirectTarget" />
	</div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import AuthForm from '~/components/AuthForm.vue';
import { useAuth } from '~/composables/useAuth';
import { useEscapeKey } from '~/composables/useEscapeKey';

definePageMeta({
	ssr: false,
});

const router = useRouter();
const route = useRoute();
const { isAuthenticated } = useAuth();

const redirectTarget = computed(() => {
	const raw = Array.isArray(route.query.redirect)
		? route.query.redirect[0]
		: route.query.redirect;
	if (typeof raw !== 'string' || !raw) return '/';
	try {
		const decoded = decodeURIComponent(raw);
		return decoded.startsWith('/') ? decoded : '/';
	} catch (_err) {
		return raw.startsWith('/') ? raw : '/';
	}
});

useEscapeKey(() => {
	router.replace('/');
});

watchEffect(() => {
	if (isAuthenticated.value) {
		router.replace(redirectTarget.value || '/');
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
			circle at 20% 20%,
			rgba(72, 187, 120, 0.5),
			transparent 55%
		),
		radial-gradient(circle at 80% 0%, rgba(96, 165, 250, 0.4), transparent 50%),
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
