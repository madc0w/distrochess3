import { createError, defineEventHandler, readBody } from 'h3';
import { ObjectId } from 'mongodb';
import type { ChatReadState } from '../../types/chat';
import type { Game } from '../../types/game';
import { verifyAuthToken } from '../../utils/auth';
import { includesId } from '../../utils/includesId';
import { getDb } from '../../utils/mongo';

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);
	const body = await readBody<{ gameId?: string; lastSeenAt?: string }>(event);
	const { gameId, lastSeenAt } = body || {};

	if (!gameId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_GAME_ID_REQUIRED',
		});
	}

	let gameObjectId: ObjectId;
	try {
		gameObjectId = new ObjectId(gameId);
	} catch (_err) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_INVALID_GAME_ID',
		});
	}

	const db = await getDb();
	const game = await db
		.collection<Game>('games')
		.findOne({ _id: gameObjectId });

	if (!game) {
		throw createError({
			statusCode: 404,
			statusMessage: 'GAME_NOT_FOUND',
		});
	}

	const userCanChat =
		includesId(game.whiteUserIds, userId) ||
		includesId(game.blackUserIds, userId);
	if (!userCanChat) {
		throw createError({
			statusCode: 403,
			statusMessage: 'ERR_CHAT_NOT_ALLOWED',
		});
	}

	let parsedDate = new Date();
	if (lastSeenAt) {
		const candidate = new Date(lastSeenAt);
		if (!Number.isNaN(candidate.getTime())) {
			parsedDate = candidate;
		}
	}

	await db
		.collection<ChatReadState>('chatStates')
		.updateOne(
			{ gameId: gameObjectId, userId },
			{ $set: { lastSeenAt: parsedDate } },
			{ upsert: true }
		);

	return { lastSeenAt: parsedDate.toISOString() };
});
