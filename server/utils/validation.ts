import { createError } from 'h3';

export const PASSWORD_MIN_LENGTH = 6;

export function validatePassword(
	password: unknown
): asserts password is string {
	if (
		!password ||
		typeof password !== 'string' ||
		password.length < PASSWORD_MIN_LENGTH
	) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_PASSWORD_TOO_SHORT',
		});
	}
}
