import { Chess } from 'chess.js';
import { defineEventHandler, getQuery } from 'h3';
import { ObjectId } from 'mongodb';
import { maxMoveTimeMins, newGameProbability } from '~/constants/game';
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
		await db.collection<Game>('games').updateMany(
			{ currentTurnUserId: userId },
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

		// console.log(`user ${userId} : allGames`, allGames);

		// Filter games that are available to the user
		const availableGames = allGames.filter((game: Game) => {
			// Helper that compares ObjectId-like values by string form
			const includesId = (arr: any[] = [], id: any) =>
				arr.some((x) => x != null && x.toString() === id.toString());

			// console.log('blackUserIds', game.blackUserIds);
			// console.log('userId', userId);
			// console.log('includes', includesId(game.blackUserIds, userId));

			// Game is available if either side is unassigned to current user
			if (
				!includesId(game.whiteUserIds, userId) &&
				!includesId(game.blackUserIds, userId)
			) {
				return true;
			}

			// Game is available if user is assigned to a side and it's their turn
			const chessGame = new Chess(game.history[game.history.length - 1].fen);
			const currentTurn = chessGame.turn(); // 'w' for white, 'b' for black

			return (
				(currentTurn === 'w' && includesId(game.whiteUserIds, userId)) ||
				(currentTurn === 'b' && includesId(game.blackUserIds, userId))
			);
		});

		// console.log(`user ${userId} : availableGames`, availableGames);

		const currentGame: Game =
			availableGames.find((g) => g.history.length > 1) || availableGames[0];
		const now = new Date();
		if (currentGame) {
			currentGame.currentTurnStartDate = now;
			currentGame.currentTurnUserId = userId;

			// console.log(
			// 	`update game ${currentGame._id} to set turn for user ${userId}`
			// );
			// persist the current turn info to the database
			await db
				.collection<Game>('games')
				.updateOne(
					{ _id: currentGame._id },
					{ $set: { currentTurnStartDate: now, currentTurnUserId: userId } }
				);

			// Build a map of userId => userName for any userIds referenced in history
			const userIds = Array.from(
				new Set(
					currentGame.history
						.map((h) => h.userId)
						.filter((id) => id != null)
						.map((id) => id.toString())
				)
			).map((idStr) => new ObjectId(idStr));

			const userNamesMap: Record<string, string> = {};
			if (userIds.length > 0) {
				const users = await db

					.collection('users')
					.find({ _id: { $in: userIds } }, { projection: { name: 1 } })
					.toArray();
				users.forEach((u: any) => {
					userNamesMap[u._id.toString()] = u.name;
				});
			}

			return {
				...currentGame,
				userNamesMap,
			};
		} else if (Math.random() < newGameProbability) {
			// compute next numeric id (max existing id + 1)
			const last = await db
				.collection<Game>('games')
				.find({}, { projection: { id: 1 } })
				.sort({ id: -1 })
				.limit(1)
				.toArray();
			const maxId = Number(last[0]?.id ?? 0);
			const id: Number = maxId + 1;

			const chess = new Chess();
			const newGame: Game = {
				_id: new ObjectId(),
				id,
				whiteUserIds: [],
				blackUserIds: [],
				history: [
					{
						fen: chess.fen(),
						date: now,
						userId: null,
					},
				],
				createdDate: now,
				lastMoveDate: null,
				currentTurnUserId: userId,
				currentTurnStartDate: now,
			};

			await db.collection<Game>('games').insertOne(newGame);
			return newGame;
		}

		return null;
	} catch (error) {
		console.error('game.get failed', error);
		throw error;
	}
});
