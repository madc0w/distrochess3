import { createError, getHeader, H3Event } from 'h3';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export interface JWTPayload {
	userId: string;
	email: string;
	firstName: string;
	lastName: string;
}

export function verifyAuthToken(event: H3Event): ObjectId {
	const authHeader = getHeader(event, 'Authorization');
	// console.log('[verifyAuthToken] Incoming Authorization header:', authHeader);
	// console.log('[verifyAuthToken] JWT_SECRET:', process.env.JWT_SECRET);
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw createError({
			statusCode: 401,
			statusMessage: 'ERR_UNAUTHORIZED_NO_TOKEN',
		});
	}

	const token = authHeader.substring(7);

	try {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw createError({
				statusCode: 500,
				statusMessage: 'ERR_JWT_SECRET_MISSING',
			});
		}
		return new ObjectId((jwt.verify(token, secret) as JWTPayload).userId);
	} catch (err) {
		console.error('[verifyAuthToken] JWT verification error:', err);
		throw createError({
			statusCode: 401,
			statusMessage: 'ERR_INVALID_AUTH_TOKEN',
		});
	}
}
