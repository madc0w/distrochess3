import { createError, defineEventHandler, getQuery } from 'h3';
import { ObjectId } from 'mongodb';
import { en } from '../../../i18n/en';
import type { UserDoc } from '../../types/user';
import { getDb } from '../../utils/mongo';

const SUPPORTED_LOCALES = Object.keys(en.languages);

type SupportedLocale = typeof SUPPORTED_LOCALES[number];

type LocaleResponse = {
	preferredLocale: SupportedLocale;
};

function normalizeLocale(value?: string | null): SupportedLocale {
	if (!value) return 'en';
	const normalized = value.toLowerCase().split('-')[0];
	return SUPPORTED_LOCALES.includes(normalized)
		? (normalized as SupportedLocale)
		: 'en';
}

function extractUserId(value: unknown): string {
	if (Array.isArray(value)) return value[0] ?? '';
	return typeof value === 'string' ? value : '';
}

function parseUserId(value: unknown): ObjectId {
	const trimmed = extractUserId(value).trim();
	if (!trimmed || !ObjectId.isValid(trimmed)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_INVALID_USER_ID',
		});
	}

	return new ObjectId(trimmed);
}

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const userObjectId = parseUserId(query.userId);

	const db = await getDb();
	const user = await db
		.collection<UserDoc>('users')
		.findOne({ _id: userObjectId }, { projection: { preferredLocale: 1 } });

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'ERR_USER_NOT_FOUND',
		});
	}

	const payload: LocaleResponse = {
		preferredLocale: normalizeLocale(user.preferredLocale),
	};

	return payload;
});
