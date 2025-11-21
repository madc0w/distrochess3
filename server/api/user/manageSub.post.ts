import { createError, defineEventHandler, readBody } from 'h3';
import { ObjectId } from 'mongodb';
import type { UserDoc } from '../../types/user';
import { getDb } from '../../utils/mongo';

interface RequestBody {
	userId?: string;
	isSubscribe: boolean;
}

function parseUserId(value?: string): ObjectId {
	const trimmed = value?.trim();
	if (!trimmed || !ObjectId.isValid(trimmed)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_INVALID_USER_ID',
		});
	}

	return new ObjectId(trimmed);
}

export default defineEventHandler(async (event) => {
	const body = (await readBody<RequestBody>(event)) ?? {};
	const userObjectId = parseUserId(body.userId);

	const db = await getDb();
	const users = db.collection<UserDoc>('users');
	const result = await users.updateOne(
		{ _id: userObjectId },
		{ $set: { unsubscribeDate: body.isSubscribe ? null : new Date() } }
	);

	if (!result.matchedCount) {
		throw createError({
			statusCode: 404,
			statusMessage: 'ERR_USER_NOT_FOUND',
		});
	}

	return { success: true };
});
