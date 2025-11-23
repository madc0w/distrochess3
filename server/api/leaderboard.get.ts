import { defineEventHandler } from 'h3';
import { getDb } from '~/server/utils/mongo';

export default defineEventHandler(async (event) => {
	const db = await getDb();
	const usersCollection = db.collection('users');

	// Get top 80 players sorted by score
	const players = await usersCollection
		.find({}, { projection: { _id: 1, name: 1, score: 1, createdDate: 1 } })
		.sort({ score: -1 })
		.limit(80)
		.toArray();

	return players;
});
