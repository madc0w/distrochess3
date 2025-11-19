import { createError, defineEventHandler, readBody } from 'h3';
import jwt from 'jsonwebtoken';
import { randomBytes, scryptSync } from 'node:crypto';
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

function hashPassword(password: string): string {
	const salt = randomBytes(16).toString('hex');
	const derived = scryptSync(password, salt, 64);
	return `${salt}:${derived.toString('hex')}`;
}

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { email, name, password } = body || {};

		if (!email || typeof email !== 'string') {
			throw createError({
				statusCode: 400,
				statusMessage: 'Email is required',
			});
		}
		if (!name || typeof name !== 'string') {
			throw createError({
				statusCode: 400,
				statusMessage: 'Name is required',
			});
		}
		if (!password || typeof password !== 'string' || password.length < 6) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Password must be at least 6 characters',
			});
		}

		const db = await getDb();
		const users = db.collection<UserDoc>('users');

		// Check for existing user
		const existing = await users.findOne({ email: email.toLowerCase() });
		if (existing) {
			throw createError({
				statusCode: 409,
				statusMessage: 'Email already registered',
			});
		}

		// Hash password and create user
		const passwordHash = hashPassword(password);
		const doc: UserDoc = {
			email: email.toLowerCase(),
			name: name.trim(),
			passwordHash,
			createdAt: new Date(),
		};

		const insertResult = await users.insertOne(doc);
		const _id = insertResult.insertedId.toString();
		const token = generateToken(_id, doc.email, doc.name);

		return {
			user: {
				_id,
				email: doc.email,
				name: doc.name,
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
			statusMessage: 'Account creation failed',
		});
	}
});
