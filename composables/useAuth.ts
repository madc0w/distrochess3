import { useState } from 'nuxt/app';
import { computed, onMounted, watch } from 'vue';

export type AuthPayload = {
	user: {
		_id: string;
		email: string;
		name: string;
	};
	token: string;
};

export function useAuth() {
	const auth = useState<AuthPayload | null>('auth', () => null);

	onMounted(() => {
		if (typeof window !== 'undefined') {
			try {
				const raw = localStorage.getItem('auth');
				if (raw) auth.value = JSON.parse(raw);
			} catch (_) {
				// ignore parse errors
			}
		}
	});

	watch(
		auth,
		(val) => {
			if (typeof window === 'undefined') return;
			if (val) localStorage.setItem('auth', JSON.stringify(val));
			else localStorage.removeItem('auth');
		},
		{ deep: true }
	);

	const isAuthenticated = computed(() => !!auth.value);

	async function signup(name: string, email: string, password: string) {
		try {
			const response = await $fetch<AuthPayload>('/api/auth/signup', {
				method: 'POST',
				body: { name, email, password },
			});
			auth.value = response;
			return { success: true };
		} catch (error: any) {
			console.error('Signup error:', error);
			return {
				success: false,
				error:
					error.data?.statusMessage || error.statusMessage || 'Signup failed',
			};
		}
	}

	async function signin(email: string, password: string) {
		try {
			const response = await $fetch<AuthPayload>('/api/auth/signin', {
				method: 'POST',
				body: { email, password },
			});
			auth.value = response;
			return { success: true };
		} catch (error: any) {
			console.error('Signin error:', error);
			return {
				success: false,
				error:
					error.data?.statusMessage || error.statusMessage || 'Signin failed',
			};
		}
	}

	function signout() {
		auth.value = null;
	}

	function getAuthHeader() {
		return auth.value?.token
			? { Authorization: `Bearer ${auth.value.token}` }
			: {};
	}

	return {
		auth: computed(() => auth.value),
		user: computed(() => auth.value?.user || null),
		isAuthenticated,
		signup,
		signin,
		signout,
		getAuthHeader,
	};
}
