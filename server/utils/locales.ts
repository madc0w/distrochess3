const SUPPORTED_LOCALES = ['en', 'fr'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export function normalizeLocale(value: unknown): SupportedLocale {
	if (typeof value !== 'string') return 'en';
	const langCode = value.split('-')[0].toLowerCase();
	return SUPPORTED_LOCALES.includes(langCode as SupportedLocale)
		? (langCode as SupportedLocale)
		: 'en';
}
