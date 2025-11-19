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
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized: No valid authentication token provided',
		});
	}

	const token = authHeader.substring(7);

	try {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error('JWT_SECRET is not defined');
		}
		return new ObjectId((jwt.verify(token, secret) as JWTPayload).userId);
	} catch (err) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Invalid authentication token',
		});
	}
}
