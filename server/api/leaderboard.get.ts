import { createError, defineEventHandler } from 'h3';
import { getDb } from '~/server/utils/mongo';

export default defineEventHandler(async (event) => {
	// console.log('[Leaderboard] Request received');

	try {
		const db = await getDb();
		// console.log('[Leaderboard] DB connected');

		const usersCollection = db.collection('users');
		const players = await usersCollection
			.find(
				{},
				{
					projection: {
						_id: 1,
						name: 1,
						score: 1,
						createdDate: 1,
						wins: 1,
						losses: 1,
						draws: 1,
					},
				}
			)
			.sort({ score: -1 })
			.limit(80)
			.toArray();

		// Add counts for wins, losses, and draws
		const playersWithCounts = players.map((player) => ({
			...player,
			wins: player.wins?.length || 0,
			losses: player.losses?.length || 0,
			draws: player.draws?.length || 0,
		}));

		// console.log(`[Leaderboard] Returning ${playersWithCounts.length} players`);
		return playersWithCounts;
	} catch (error: any) {
		// console.error('[Leaderboard] Error:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch leaderboard',
		});
	}
});
