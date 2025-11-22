import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export function hashPassword(password: string): string {
	const salt = randomBytes(16).toString('hex');
	const derived = scryptSync(password, salt, 64);
	return `${salt}:${derived.toString('hex')}`;
}

export function verifyPassword(password: string, hash: string): boolean {
	const [salt, key] = hash.split(':');
	if (!salt || !key) return false;
	const derived = scryptSync(password, salt, 64);
	const keyBuffer = Buffer.from(key, 'hex');
	return timingSafeEqual(derived, keyBuffer);
}
