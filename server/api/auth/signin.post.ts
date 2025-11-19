import { createError, defineEventHandler, readBody } from 'h3';
import jwt from 'jsonwebtoken';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { getDb } from '../../utils/mongo';

interface UserDoc {
	email: string;
	name: string;
	passwordHash: string;
	createdAt: Date;
}

// Generate JWT token (never expires)
function generateToken(userId: string, email: string, name: string) {
	const secret = process.env.JWT_SECRET || process.env.NITRO_JWT_SECRET;
	if (!secret) {
		throw new Error('JWT_SECRET is not defined');
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
				statusMessage: 'Email is required',
			});
		}
		if (!password || typeof password !== 'string') {
			throw createError({
				statusCode: 400,
				statusMessage: 'Password is required',
			});
		}

		const db = await getDb();
		const users = db.collection<UserDoc>('users');

		// Find user
		const user = await users.findOne({ email: email.toLowerCase() });
		if (!user) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Invalid email or password',
			});
		}

		// Verify password
		if (!verifyPassword(password, user.passwordHash)) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Invalid email or password',
			});
		}

		const _id = user._id.toString();
		const token = generateToken(_id, user.email, user.name);

		return {
			user: {
				_id,
				email: user.email,
				name: user.name,
			},
			token,
		};
	} catch (error: any) {
		// Re-throw if it's already an H3 error
		if (error.statusCode) {
			throw error;
		}
		// Otherwise wrap it
		throw createError({
			statusCode: 500,
			statusMessage: 'Sign in failed',
		});
	}
});
