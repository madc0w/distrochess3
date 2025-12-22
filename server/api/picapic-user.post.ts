import { createError, defineEventHandler, getRequestIP, readBody } from 'h3';
import type { PicapicUser } from '../types/picapicUser';
import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		console.log('PICAPIC-USER.POST body:', body);
		const {
			userId,
			isSignedIn,
			numTrials,
		}: { userId: string; isSignedIn: boolean; numTrials: number } = body;

		if (!userId) {
			throw createError({
				statusCode: 400,
				message: 'userId is required',
			});
		}

		const db = await getDb();
		const collection = db.collection<PicapicUser>('picapicUsers');

		const now = new Date();
		const ipAddress = getRequestIP(event, { xForwardedFor: true }) || null;

		// Update lastActiveDate, or create new document if it doesn't exist
		await collection.updateOne(
			{ userId },
			{
				$set: { lastActiveDate: now, ipAddress, numTrials },
				$setOnInsert: {
					userId,
					isSignedIn,
					firstActiveDate: now,
				},
			},
			{ upsert: true }
		);

		return { success: true };
	} catch (error: any) {
		console.error('Error updating picapic user:', error);
		throw createError({
			statusCode: error.statusCode || 500,
			message: error.message || 'Failed to update picapic user',
		});
	}
});
