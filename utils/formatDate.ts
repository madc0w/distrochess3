export type DateInput = Date | string | number | null | undefined;

function toDate(value: DateInput): Date | null {
	if (value instanceof Date)
		return Number.isNaN(value.getTime()) ? null : value;
	if (value === null || value === undefined) return null;
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(
	value: DateInput,
	locale = 'en',
	fallback = '--'
): string {
	const date = toDate(value);
	if (!date) return fallback;
	const lang = locale || 'en';
	const month = new Intl.DateTimeFormat(lang, { month: 'short' }).format(date);
	const day = date.getDate().toString().padStart(2, '0');
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${day} ${month}, ${year} ${hours}:${minutes}`;
}

export function formatDateOnly(
	value: DateInput,
	locale = 'en',
	fallback = '--'
): string {
	const date = toDate(value);
	if (!date) return fallback;
	const lang = locale || 'en';
	const month = new Intl.DateTimeFormat(lang, { month: 'short' }).format(date);
	const day = date.getDate().toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day} ${month}, ${year}`;
}

export function formatMemberSince(
	value: DateInput,
	locale = 'en',
	fallback = '--'
): string {
	const date = toDate(value);
	if (!date) return fallback;

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays < 1) {
		return locale === 'fr' ? "Aujourd'hui" : 'Today';
	} else if (diffDays === 1) {
		return locale === 'fr' ? '1 jour' : '1 day';
	} else if (diffDays < 30) {
		return locale === 'fr' ? `${diffDays} jours` : `${diffDays} days`;
	} else if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		return locale === 'fr'
			? months === 1
				? '1 mois'
				: `${months} mois`
			: months === 1
			? '1 month'
			: `${months} months`;
	} else {
		const years = Math.floor(diffDays / 365);
		return locale === 'fr'
			? years === 1
				? '1 an'
				: `${years} ans`
			: years === 1
			? '1 year'
			: `${years} years`;
	}
}
