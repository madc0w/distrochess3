import { createError, defineEventHandler, readBody } from 'h3';
import jwt from 'jsonwebtoken';
import type { UserDoc } from '../../types/user';
import { sendWelcomeEmail } from '../../utils/email';
import { normalizeLocale } from '../../utils/locales';
import { getDb } from '../../utils/mongo';
import { hashPassword } from '../../utils/password';
import { validatePassword } from '../../utils/validation';

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

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { email, name, password, locale } = body || {};
		const preferredLocale = normalizeLocale(locale);

		if (!email || typeof email !== 'string') {
			throw createError({
				statusCode: 400,
				statusMessage: 'ERR_EMAIL_REQUIRED',
			});
		}
		if (!name || typeof name !== 'string') {
			throw createError({
				statusCode: 400,
				statusMessage: 'ERR_NAME_REQUIRED',
			});
		}
		validatePassword(password);

		const db = await getDb();
		const users = db.collection<UserDoc>('users');

		// Check for existing user
		const existing = await users.findOne({ email: email.toLowerCase() });
		if (existing) {
			throw createError({
				statusCode: 409,
				statusMessage: 'ERR_EMAIL_REGISTERED',
			});
		}

		// Hash password and create user
		const passwordHash = hashPassword(password);
		const doc: UserDoc = {
			createdDate: new Date(),
			email: email.toLowerCase(),
			name: name.trim(),
			passwordHash,
			score: 1000,
			preferredLocale,
		};

		const insertResult = await users.insertOne(doc);
		const _id = insertResult.insertedId.toString();
		const token = generateToken(_id, doc.email, doc.name);

		// Send welcome email asynchronously (do not block response)
		sendWelcomeEmail(doc, preferredLocale).catch((err: any) => {
			console.error('Failed to send welcome email:', err);
		});

		return {
			user: {
				_id,
				email: doc.email,
				name: doc.name,
				preferredLocale: doc.preferredLocale,
			},
			token,
		};
	} catch (error: any) {
		// Re-throw if it's already an H3 error (we store codes in `statusMessage`)
		if (error.statusCode) {
			throw error;
		}
		// Otherwise wrap it with a generic error code for client-side i18n
		throw createError({
			statusCode: 500,
			statusMessage: 'ERR_ACCOUNT_CREATION_FAILED',
		});
	}
});
