import { Chess } from 'chess.js';
import { createError, defineEventHandler, getQuery } from 'h3';
import type { Db, Filter, ObjectId } from 'mongodb';
import { ObjectId as MongoObjectId } from 'mongodb';
import { maxMoveTimeMins, newGameProbability } from '~/constants/game';
import type { Game } from '../types/game';
import { verifyAuthToken } from '../utils/auth';
import { includesId } from '../utils/includesId';
import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	// console.log('=== GAME.GET CALLED ===', process.pid);
	try {
		const userId = verifyAuthToken(event);
		const query = getQuery(event);
		const excludeGameId = query.gameId as string | undefined;
		const requestedGameId = query.requestedGameId as string | undefined;

		const db = await getDb();

		// Reset turns for games where the current turn has exceeded the time limit
		const maxMoveTimeMs = maxMoveTimeMins * 60 * 1000;
		const cutoffDate = new Date(Date.now() - maxMoveTimeMs);

		await db.collection<Game>('games').updateMany(
			{
				$or: [
					{ currentTurnUserId: userId },
					{
						currentTurnStartDate: { $lt: cutoffDate },
						currentTurnUserId: { $ne: null },
					},
				],
			},
			{
				$set: {
					currentTurnStartDate: null,
					currentTurnUserId: null,
				},
			}
		);

		if (requestedGameId) {
			const requestedGame = await findRequestedGame(db, requestedGameId);

			if (!requestedGame) {
				throw createError({ statusCode: 404, statusMessage: 'GAME_NOT_FOUND' });
			}

			if (!isGameAvailableToUser(requestedGame, userId)) {
				throw createError({
					statusCode: 409,
					statusMessage: 'GAME_NOT_AVAILABLE',
				});
			}

			return await hydrateGameForUser(requestedGame, userId, db);
		}

		const excludeObjectId = safelyCreateObjectId(excludeGameId);
		const allGames = await db
			.collection<Game>('games')
			.find({
				currentTurnUserId: null,
				result: null,
				...(excludeObjectId && { _id: { $ne: excludeObjectId } }),
			})
			.sort({ lastMoveDate: 1 })
			.toArray();

		// console.log(`user ${userId} : allGames`, allGames);

		// Filter games that are available to the user
		const availableGames = allGames.filter((game: Game) =>
			isGameAvailableToUser(game, userId)
		);

		// console.log(`user ${userId} : availableGames`, availableGames);

		const currentGame: Game =
			availableGames.find((g) => g.history.length > 1) || availableGames[0];
		const now = new Date();
		if (currentGame) {
			return await hydrateGameForUser(currentGame, userId, db, now);
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
				_id: new MongoObjectId(),
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

function isGameAvailableToUser(game: Game, userId: ObjectId): boolean {
	const playerIsUnassigned =
		!includesId(game.whiteUserIds, userId) &&
		!includesId(game.blackUserIds, userId);

	// If there's a draw offer pending, only allow existing players (not new players)
	if (game.drawOfferUserId && playerIsUnassigned) {
		return false;
	}

	if (playerIsUnassigned) return true;

	const latestFen = game.history?.[game.history.length - 1]?.fen;
	if (!latestFen) return false;

	const chessGame = new Chess(latestFen);
	const currentTurn = chessGame.turn();

	return (
		(currentTurn === 'w' && includesId(game.whiteUserIds, userId)) ||
		(currentTurn === 'b' && includesId(game.blackUserIds, userId))
	);
}

async function hydrateGameForUser(
	game: Game,
	userId: ObjectId,
	db: Db,
	now: Date = new Date()
) {
	const hydratedGame: Game = {
		...game,
		currentTurnStartDate: now,
		currentTurnUserId: userId,
	};

	await db
		.collection<Game>('games')
		.updateOne(
			{ _id: game._id },
			{ $set: { currentTurnStartDate: now, currentTurnUserId: userId } }
		);

	const userDataMap = await buildUserDataMap(game, db);
	return {
		...hydratedGame,
		userDataMap,
	};
}

async function buildUserDataMap(game: Game, db: Db) {
	const candidateIds = [
		...(game.history?.map((h) => h.userId).filter(Boolean) as ObjectId[]),
		...(game.whiteUserIds ?? []),
		...(game.blackUserIds ?? []),
	];

	const userIds = Array.from(
		new Set(
			candidateIds
				.filter((id): id is ObjectId => id != null)
				.map((id) => id.toString())
		)
	).map((idStr) => new MongoObjectId(idStr));

	const userDataMap: Record<string, any> = {};
	if (userIds.length > 0) {
		const users = await db
			.collection('users')
			.find(
				{ _id: { $in: userIds } },
				{ projection: { name: true, score: true } }
			)
			.toArray();
		users.forEach((u: any) => {
			userDataMap[u._id.toString()] = { name: u.name, score: u.score };
		});
	}

	return userDataMap;
}

function safelyCreateObjectId(value?: string) {
	if (!value) return undefined;
	try {
		return new MongoObjectId(value);
	} catch (_err) {
		return undefined;
	}
}

async function findRequestedGame(db: Db, requestedGameId: string) {
	const orFilters: Filter<Game>[] = [];
	const requestedObjectId = safelyCreateObjectId(requestedGameId);
	if (requestedObjectId) {
		orFilters.push({ _id: requestedObjectId });
	}

	const numericId = Number(requestedGameId);
	if (!Number.isNaN(numericId)) {
		orFilters.push({ id: numericId });
	}

	if (orFilters.length === 0) {
		return null;
	}

	const filter: Filter<Game> =
		orFilters.length === 1
			? { ...orFilters[0], result: null, currentTurnUserId: null }
			: { result: null, currentTurnUserId: null, $or: orFilters };

	return db.collection<Game>('games').findOne(filter);
}
