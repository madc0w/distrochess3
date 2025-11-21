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
