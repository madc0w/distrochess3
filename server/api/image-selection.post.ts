import { createError, defineEventHandler, readBody } from 'h3';
import { getDb } from '../utils/mongo';

interface ImageSelectionCount {
	publicId: string;
	count: number;
	lastSelectionDate: Date;
}

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { publicId }: { publicId: string } = body;

		if (!publicId) {
			throw createError({
				statusCode: 400,
				message: 'publicId is required',
			});
		}

		const db = await getDb();
		const collection = db.collection<ImageSelectionCount>(
			'imageSelectionCounts'
		);

		// Increment the count for this image (upsert if doesn't exist) and update lastSelectionDate
		await collection.updateOne(
			{ publicId },
			{ $inc: { count: 1 }, $set: { lastSelectionDate: new Date() } },
			{ upsert: true }
		);

		return { success: true };
	} catch (error: any) {
		console.error('Error recording image selection:', error);
		throw createError({
			statusCode: error.statusCode || 500,
			message: error.message || 'Failed to record image selection',
		});
	}
});
