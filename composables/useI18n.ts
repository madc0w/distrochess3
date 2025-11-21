import { useState } from 'nuxt/app';
import { computed, watch } from 'vue';
import { en, getTranslations } from '~/i18n';

type TranslationMap = Record<string, any>;

const DEFAULT_LOCALE = 'en';
const STORAGE_KEY = 'preferredLocale';
const SUPPORTED_LOCALES = Object.keys(en.languages);

function interpolate(str: string, vars: Record<string, any>): string {
	return str.replace(/\{(\w+)\}/g, (_, key) =>
		vars[key] !== undefined ? vars[key] : `{${key}}`
	);
}

function wrapTranslations(obj: TranslationMap): TranslationMap {
	return new Proxy(obj, {
		get(target, prop) {
			if (!(prop in target)) return prop as string;
			const value = target[prop as keyof typeof target];
			if (typeof value === 'string') {
				if (/\{\w+\}/.test(value)) {
					return (vars?: Record<string, any>) => {
						if (vars && typeof vars === 'object') {
							return interpolate(value, vars);
						}
						return value;
					};
				}
				return value;
			}
			if (typeof value === 'object' && value !== null) {
				return wrapTranslations(value as TranslationMap);
			}
			return value as any;
		},
	});
}

function normalizeLocale(locale?: string | null): string {
	if (!locale) return DEFAULT_LOCALE;
	const short = locale.toLowerCase().split('-')[0];
	return SUPPORTED_LOCALES.includes(short) ? short : DEFAULT_LOCALE;
}

function detectInitialLocale(): string {
	if (process.client) {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) return normalizeLocale(stored);
		} catch (_err) {
			/* ignore */
		}
		if (navigator?.language) return normalizeLocale(navigator.language);
	}
	return DEFAULT_LOCALE;
}

export function useI18n() {
	const locale = useState<string>('locale', detectInitialLocale);
	const translations = computed(() =>
		wrapTranslations(getTranslations(locale.value) as TranslationMap)
	);

	function setLocale(next: string) {
		locale.value = normalizeLocale(next);
	}

	const hasSyncedLocale = useState<boolean>('locale-sync', () => false);
	if (process.client && !hasSyncedLocale.value) {
		watch(
			locale,
			(val) => {
				const normalized = normalizeLocale(val);
				try {
					localStorage.setItem(STORAGE_KEY, normalized);
				} catch (_err) {
					/* ignore */
				}
				if (document?.documentElement) {
					document.documentElement.setAttribute('lang', normalized);
				}
			},
			{ immediate: true }
		);
		hasSyncedLocale.value = true;
	}

	return {
		locale,
		t: translations,
		setLocale,
	};
}
