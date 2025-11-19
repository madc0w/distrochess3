import { Chess } from 'chess.js';
import { defineEventHandler } from 'h3';
import { maxMoveTimeMins } from '~/constants/game';
import type { Game } from '../types/game';
import { verifyAuthToken } from '../utils/auth';
import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);

	const db = await getDb();

	// Reset turns for games where the current turn has exceeded the time limit
	const maxMoveTimeMs = maxMoveTimeMins * 60 * 1000;
	const cutoffDate = new Date(Date.now() - maxMoveTimeMs);

	await db.collection<Game>('games').updateMany(
		{
			currentTurnStartDate: { $lt: cutoffDate },
			currentTurnUserId: { $ne: null },
		},
		{
			$set: {
				currentTurnStartDate: null,
				currentTurnUserId: null,
			},
		}
	);

	const allGames = await db
		.collection<Game>('games')
		.find({
			currentTurnUserId: null,
		})
		.sort({ lastMoveDate: -1 })
		.toArray();

	// Filter games that are available to the user
	const availableGames = allGames.filter((game: Game) => {
		// Game is available if either side is unassigned to current user
		if (
			!game.whiteUserIds.includes(userId) &&
			!game.blackUserIds.includes(userId)
		) {
			return true;
		}

		// Game is available if user is assigned to a side and it's their turn
		const chess = new Chess(game.fen);
		const currentTurn = chess.turn(); // 'w' for white, 'b' for black

		return (
			(currentTurn === 'w' && game.whiteUserIds.includes(userId)) ||
			(currentTurn === 'b' && game.blackUserIds.includes(userId))
		);
	});

	return availableGames;
});
