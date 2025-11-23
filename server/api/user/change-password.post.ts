import { createError, defineEventHandler, readBody } from 'h3';
import type { UserDoc } from '../../types/user';
import { verifyAuthToken } from '../../utils/auth';
import { getDb } from '../../utils/mongo';
import { hashPassword, verifyPassword } from '../../utils/password';
import { validatePassword } from '../../utils/validation';

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);
	const body = await readBody(event);
	const { currentPassword, newPassword } = body || {};

	if (
		!currentPassword ||
		typeof currentPassword !== 'string' ||
		!currentPassword.trim()
	) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_CURRENT_PASSWORD_REQUIRED',
		});
	}

	validatePassword(newPassword);

	const db = await getDb();
	const users = db.collection<UserDoc>('users');

	const user = await users.findOne(
		{ _id: userId },
		{
			projection: {
				passwordHash: 1,
			},
		}
	);

	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: 'ERR_USER_NOT_FOUND',
		});
	}

	// Verify current password
	const isValid = verifyPassword(currentPassword, user.passwordHash);
	if (!isValid) {
		throw createError({
			statusCode: 401,
			statusMessage: 'ERR_INCORRECT_PASSWORD',
		});
	}

	// Hash and update new password
	const hashedPassword = hashPassword(newPassword);
	await users.updateOne(
		{ _id: userId },
		{ $set: { passwordHash: hashedPassword } }
	);

	return { success: true };
});
