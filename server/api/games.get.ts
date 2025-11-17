import { getDb } from '../utils/mongo';

export default defineEventHandler(async () => {
	const db = await getDb();
	const games = await db
		.collection('games')
		.find({})
		.sort({ createdAt: -1 })
		.toArray();
	return games;
});
