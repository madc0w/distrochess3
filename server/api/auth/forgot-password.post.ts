import { createError, defineEventHandler, readBody } from 'h3';
import { createHash, randomBytes } from 'node:crypto';
import type { UserDoc } from '../../types/user';
import { sendPasswordResetEmail } from '../../utils/email';
import { normalizeLocale } from '../../utils/locales';
import { getDb } from '../../utils/mongo';

const RESET_TOKEN_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_APP_BASE_URL = 'https://www.distrochess.com';

function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

function buildResetUrl(rawToken: string): string {
	const base = process.env.APP_BASE_URL || DEFAULT_APP_BASE_URL;
	const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
	const resetPath = `/reset-password?token=${encodeURIComponent(rawToken)}`;
	return `${normalizedBase}${resetPath}`;
}

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { email, locale } = body || {};

		if (!email || typeof email !== 'string') {
			throw createError({
				statusCode: 400,
				statusMessage: 'ERR_EMAIL_REQUIRED',
			});
		}

		const normalizedEmail = email.toLowerCase().trim();
		const preferredLocale = normalizeLocale(locale);

		const db = await getDb();
		const users = db.collection<UserDoc>('users');
		const user = await users.findOne({ email: normalizedEmail });

		if (!user) {
			return { success: true };
		}

		const rawToken = randomBytes(32).toString('hex');
		const hashedToken = hashToken(rawToken);
		const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRATION_MS);

		await users.updateOne(
			{ _id: user._id },
			{
				$set: {
					resetPasswordToken: hashedToken,
					resetPasswordExpires: expiresAt,
				},
			}
		);

		const resetUrl = buildResetUrl(rawToken);
		const localeForEmail = user.preferredLocale || preferredLocale;

		sendPasswordResetEmail(user, resetUrl, localeForEmail).catch((err: any) => {
			console.error('Failed to send password reset email:', err);
		});

		return { success: true };
	} catch (error: any) {
		if (error.statusCode) {
			throw error;
		}
		throw createError({
			statusCode: 500,
			statusMessage: 'ERR_FORGOT_PASSWORD_FAILED',
		});
	}
});
