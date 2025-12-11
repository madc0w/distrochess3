import { createError, defineEventHandler, getQuery } from 'h3';
import { getDb } from '../utils/mongo';

interface ImageSelectionCount {
	publicId: string;
	count: number;
}

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const publicIds = query.publicIds as string;

		if (!publicIds) {
			throw createError({
				statusCode: 400,
				message: 'publicIds query parameter is required',
			});
		}

		const publicIdArray = publicIds.split(',');

		const db = await getDb();
		const collection = db.collection<ImageSelectionCount>(
			'imageSelectionCounts'
		);

		// Get counts for all requested images
		const results = await collection
			.find({ publicId: { $in: publicIdArray } })
			.toArray();

		// Create a map with all requested publicIds, defaulting to 0 for those not found
		const countsMap: Record<string, number> = {};
		for (const id of publicIdArray) {
			countsMap[id] = 0;
		}
		for (const result of results) {
			countsMap[result.publicId] = result.count;
		}

		return { counts: countsMap };
	} catch (error: any) {
		console.error('Error fetching image selection counts:', error);
		throw createError({
			statusCode: error.statusCode || 500,
			message: error.message || 'Failed to fetch image selection counts',
		});
	}
});
