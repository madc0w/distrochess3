import { Chess } from 'chess.js';
import { defineEventHandler } from 'h3';
import type { Game } from '../types/game';
import { verifyAuthToken } from '../utils/auth';
import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);

	const db = await getDb();
	const allGames = await db
		.collection<Game>('games')
		.find({})
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
