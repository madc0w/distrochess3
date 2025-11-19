import { Chess } from 'chess.js';
import { defineEventHandler, getQuery } from 'h3';
import { ObjectId } from 'mongodb';
import { maxMoveTimeMins } from '~/constants/game';
import type { Game } from '../types/game';
import { verifyAuthToken } from '../utils/auth';
import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	// console.log('=== GAME.GET CALLED ===', process.pid);
	try {
		const userId = verifyAuthToken(event);
		const query = getQuery(event);
		const excludeGameId = query.gameId as string | undefined;

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
				...(excludeGameId && { _id: { $ne: new ObjectId(excludeGameId) } }),
			})
			.sort({ lastMoveDate: 1 })
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
			const chessGame = new Chess(game.history[game.history.length - 1].fen);
			const currentTurn = chessGame.turn(); // 'w' for white, 'b' for black

			return (
				(currentTurn === 'w' && game.whiteUserIds.includes(userId)) ||
				(currentTurn === 'b' && game.blackUserIds.includes(userId))
			);
		});

		const currentGame: Game = availableGames[0];
		if (currentGame) {
			const now = new Date();
			currentGame.currentTurnStartDate = now;
			currentGame.currentTurnUserId = userId;

			console.log(
				`update game ${currentGame._id} to set turn for user ${userId}`
			);
			// persist the current turn info to the database
			await db
				.collection<Game>('games')
				.updateOne(
					{ _id: currentGame._id },
					{ $set: { currentTurnStartDate: now, currentTurnUserId: userId } }
				);
			return currentGame;
		}

		return null;
	} catch (error) {
		console.error('game.get failed', error);
		throw error;
	}
});
