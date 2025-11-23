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
	translations: {
		today: string;
		day: string;
		days: string;
		month: string;
		months: string;
		year: string;
		years: string;
	},
	fallback = '--'
): string {
	const date = toDate(value);
	if (!date) return fallback;

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays < 1) {
		return translations.today;
	} else if (diffDays === 1) {
		return translations.day.replace('{count}', '1');
	} else if (diffDays < 30) {
		return translations.days.replace('{count}', String(diffDays));
	} else if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		return months === 1
			? translations.month.replace('{count}', '1')
			: translations.months.replace('{count}', String(months));
	} else {
		const years = Math.floor(diffDays / 365);
		return years === 1
			? translations.year.replace('{count}', '1')
			: translations.years.replace('{count}', String(years));
	}
}
