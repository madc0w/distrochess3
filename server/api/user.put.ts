import { createError, defineEventHandler, readBody } from 'h3';
import { en } from '../../i18n/en';
import type { UserDoc } from '../types/user';
import { verifyAuthToken } from '../utils/auth';
import { getDb } from '../utils/mongo';

const SUPPORTED_LOCALES = Object.keys(en.languages) as Array<
	keyof typeof en.languages
>;
type SupportedLocale = typeof SUPPORTED_LOCALES[number];

function normalizeLocale(value: unknown): SupportedLocale {
	if (typeof value !== 'string') return 'en';
	const langCode = value.split('-')[0].toLowerCase();
	return SUPPORTED_LOCALES.includes(langCode as SupportedLocale)
		? (langCode as SupportedLocale)
		: 'en';
}

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);
	const body = await readBody(event);
	const { name, email, preferredLocale, duckOpinion } = body || {};
	if (!name || typeof name !== 'string' || !name.trim()) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_NAME_REQUIRED',
		});
	}

	if (!email || typeof email !== 'string' || !email.trim()) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_EMAIL_REQUIRED',
		});
	}

	const normalizedEmail = email.toLowerCase();
	const normalizedLocale = normalizeLocale(preferredLocale);
	const trimmedName = name.trim();

	const db = await getDb();
	const users = db.collection<UserDoc>('users');

	const currentUser = await users.findOne(
		{ _id: userId },
		{
			projection: {
				name: 1,
				email: 1,
				score: 1,
				createdDate: 1,
				preferredLocale: 1,
				duckOpinion: 1,
			},
		}
	);

	if (!currentUser) {
		throw createError({
			statusCode: 404,
			statusMessage: 'ERR_USER_NOT_FOUND',
		});
	}

	if (normalizedEmail !== currentUser.email) {
		const duplicate = await users.findOne({
			email: normalizedEmail,
			_id: { $ne: userId },
		});
		if (duplicate) {
			throw createError({
				statusCode: 409,
				statusMessage: 'ERR_EMAIL_REGISTERED',
			});
		}
	}

	const updateFields: any = {
		name: trimmedName,
		email: normalizedEmail,
		preferredLocale: normalizedLocale,
	};

	if (duckOpinion === 'favor' || duckOpinion === 'opposed') {
		updateFields.duckOpinion = duckOpinion;
	}

	await users.updateOne(
		{ _id: userId },
		{
			$set: updateFields,
		}
	);

	const updatedUser = await users.findOne(
		{ _id: userId },
		{
			projection: {
				name: 1,
				email: 1,
				score: 1,
				createdDate: 1,
				preferredLocale: 1,
				duckOpinion: 1,
			},
		}
	);

	if (!updatedUser) {
		throw createError({
			statusCode: 500,
			statusMessage: 'ERR_GENERIC',
		});
	}

	return {
		_id: userId.toString(),
		name: updatedUser.name,
		email: updatedUser.email,
		score: updatedUser.score,
		preferredLocale: updatedUser.preferredLocale,
		createdDate: updatedUser.createdDate?.toISOString() ?? null,
		duckOpinion: updatedUser.duckOpinion,
	};
});
