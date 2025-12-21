import { createError, defineEventHandler, readBody } from 'h3';
import type { UserDoc } from '../types/user';
import { verifyAuthToken } from '../utils/auth';
import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);
	const body = await readBody(event);
	const { picapicScore, picapicTrials } = body || {};

	if (typeof picapicScore !== 'number' || typeof picapicTrials !== 'number') {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_INVALID_DATA',
		});
	}

	if (picapicScore < 0 || picapicTrials < 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_INVALID_DATA',
		});
	}

	const db = await getDb();
	const users = db.collection<UserDoc>('users');

	const result = await users.updateOne(
		{ _id: userId },
		{
			$set: {
				picapicScore,
				picapicTrials,
			},
		}
	);

	if (result.matchedCount === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: 'ERR_USER_NOT_FOUND',
		});
	}

	return {
		success: true,
		picapicScore,
		picapicTrials,
	};
});
