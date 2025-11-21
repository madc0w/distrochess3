import { useState } from 'nuxt/app';
import { computed, onMounted, watch } from 'vue';
import { useI18n } from './useI18n';
import { translateServerError } from './useServerErrors';

export type AuthPayload = {
	user: {
		_id: string;
		email: string;
		name: string;
		preferredLocale?: string;
	};
	token: string;
};

export function useAuth() {
	const auth = useState<AuthPayload | null>('auth', () => null);
	const { t, setLocale, locale } = useI18n();

	onMounted(() => {
		if (typeof window !== 'undefined') {
			try {
				const raw = localStorage.getItem('auth');
				if (raw) auth.value = JSON.parse(raw);
			} catch (_) {
				// ignore parse errors
			}
		}
		if (auth.value?.user?.preferredLocale) {
			setLocale(auth.value.user.preferredLocale);
		}
	});

	watch(
		auth,
		(val) => {
			if (typeof window === 'undefined') return;
			if (val) localStorage.setItem('auth', JSON.stringify(val));
			else localStorage.removeItem('auth');
			if (val?.user?.preferredLocale) {
				setLocale(val.user.preferredLocale);
			}
		},
		{ deep: true }
	);

	const isAuthenticated = computed(() => !!auth.value);

	async function signup(name: string, email: string, password: string) {
		try {
			const preferredLocale = locale.value;
			const response = await $fetch<AuthPayload>('/api/auth/signup', {
				method: 'POST',
				body: { name, email, password, locale: preferredLocale },
			});
			auth.value = response;
			if (response.user?.preferredLocale) {
				setLocale(response.user.preferredLocale);
			} else {
				setLocale(preferredLocale);
			}
			return { success: true };
		} catch (error: any) {
			console.error('Signup error:', error);
			return {
				success: false,
				error: translateServerError(error, t.value) || 'Signup failed',
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
			if (response.user?.preferredLocale) {
				setLocale(response.user.preferredLocale);
			}
			return { success: true };
		} catch (error: any) {
			console.error('Signin error:', error);
			return {
				success: false,
				error: translateServerError(error, t.value) || 'Signin failed',
			};
		}
	}

	function signout() {
		auth.value = null;
	}

	function getAuthHeader() {
		if (auth.value?.token) {
			return { Authorization: `Bearer ${auth.value.token}` };
		}
		return undefined;
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
