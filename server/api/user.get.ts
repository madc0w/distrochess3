import { createError, defineEventHandler } from 'h3';
import type { UserDoc } from '../types/user';
import { verifyAuthToken } from '../utils/auth';
import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);
	const db = await getDb();
	const user = await db.collection<UserDoc>('users').findOne(
		{ _id: userId },
		{
			projection: {
				name: 1,
				email: 1,
				score: 1,
				createdDate: 1,
				preferredLocale: 1,
			},
		}
	);

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'ERR_USER_NOT_FOUND',
		});
	}

	return {
		_id: userId.toString(),
		name: user.name,
		email: user.email,
		score: user.score,
		preferredLocale: user.preferredLocale,
		createdDate: user.createdDate?.toISOString() ?? null,
	};
});
