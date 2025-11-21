import { createError, defineEventHandler, readBody } from 'h3';
import jwt from 'jsonwebtoken';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import type { UserDoc } from '../../types/user';
import { getDb } from '../../utils/mongo';

// Generate JWT token (never expires)
function generateToken(userId: string, email: string, name: string) {
	const secret = process.env.JWT_SECRET || process.env.NITRO_JWT_SECRET;
	if (!secret) {
		throw createError({
			statusCode: 500,
			statusMessage: 'ERR_JWT_SECRET_MISSING',
		});
	}

	const payload = {
		userId,
		email,
		name,
	};

	// No expiration - token is valid forever
	return jwt.sign(payload, secret);
}

function verifyPassword(password: string, hash: string): boolean {
	const [salt, key] = hash.split(':');
	const derived = scryptSync(password, salt, 64);
	const keyBuffer = Buffer.from(key, 'hex');
	return timingSafeEqual(derived, keyBuffer);
}

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { email, password } = body || {};

		if (!email || typeof email !== 'string') {
			throw createError({
				statusCode: 400,
				statusMessage: 'ERR_EMAIL_REQUIRED',
			});
		}
		if (!password || typeof password !== 'string') {
			throw createError({
				statusCode: 400,
				statusMessage: 'ERR_PASSWORD_REQUIRED',
			});
		}

		const db = await getDb();
		const users = db.collection<UserDoc>('users');

		// Find user
		const user = await users.findOne({ email: email.toLowerCase() });
		if (!user) {
			throw createError({
				statusCode: 401,
				statusMessage: 'ERR_INVALID_CREDENTIALS',
			});
		}

		// Verify password
		if (!verifyPassword(password, user.passwordHash)) {
			throw createError({
				statusCode: 401,
				statusMessage: 'ERR_INVALID_CREDENTIALS',
			});
		}

		const _id = user._id.toString();
		const token = generateToken(_id, user.email, user.name);

		return {
			user: {
				_id,
				email: user.email,
				name: user.name,
				preferredLocale: user.preferredLocale,
			},
			token,
		};
	} catch (error: any) {
		// Re-throw if it's already an H3 error (statusMessage contains i18n code)
		if (error.statusCode) {
			throw error;
		}
		throw createError({
			statusCode: 500,
			statusMessage: 'ERR_SIGNIN_FAILED',
		});
	}
});
