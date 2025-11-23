import { createError, defineEventHandler, readBody } from 'h3';
import { createHash } from 'node:crypto';
import type { UserDoc } from '../../types/user';
import { getDb } from '../../utils/mongo';
import { hashPassword } from '../../utils/password';
import { validatePassword } from '../../utils/validation';

function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { token, password } = body || {};

		if (!token || typeof token !== 'string') {
			throw createError({
				statusCode: 400,
				statusMessage: 'ERR_RESET_TOKEN_INVALID',
			});
		}

		validatePassword(password);

		const hashedToken = hashToken(token);
		const now = new Date();

		const db = await getDb();
		const users = db.collection<UserDoc>('users');
		const user = await users.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordExpires: { $gt: now },
		});

		if (!user) {
			throw createError({
				statusCode: 400,
				statusMessage: 'ERR_RESET_TOKEN_INVALID',
			});
		}

		const passwordHash = hashPassword(password);
		await users.updateOne(
			{ _id: user._id },
			{
				$set: { passwordHash },
				$unset: {
					resetPasswordToken: '',
					resetPasswordExpires: '',
				},
			}
		);

		return { success: true };
	} catch (error: any) {
		if (error.statusCode) {
			throw error;
		}
		throw createError({
			statusCode: 500,
			statusMessage: 'ERR_RESET_PASSWORD_FAILED',
		});
	}
});
