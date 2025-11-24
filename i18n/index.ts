import { de } from './de';
import type { Translations } from './en';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';

const translations: Record<string, any> = {
	en,
	fr,
	de,
	es,
};

export function getTranslations(locale: string): Translations {
	return (translations[locale] || translations.en) as Translations;
}

export { de, en, es, fr };
export type { Translations };
