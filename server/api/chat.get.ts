import { createError, defineEventHandler, getQuery } from 'h3';
import type { Filter } from 'mongodb';
import { ObjectId } from 'mongodb';
import type { ChatMessage, ChatReadState } from '../types/chat';
import type { Game } from '../types/game';
import { verifyAuthToken } from '../utils/auth';
import { getPlayerSide } from '../utils/getPlayerSide';
import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);
	const query = getQuery(event);
	const gameId = query.gameId as string | undefined;
	const since = query.since as string | undefined;

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

	const side = getPlayerSide(game, userId);

	if (!side) {
		throw createError({
			statusCode: 403,
			statusMessage: 'ERR_CHAT_NOT_ALLOWED',
		});
	}

	let sinceDate: Date | null = null;
	if (since) {
		const parsed = new Date(since);
		if (!Number.isNaN(parsed.getTime())) {
			sinceDate = parsed;
		}
	}

	const filter: Filter<ChatMessage> = {
		gameId: gameObjectId,
		side,
		...(sinceDate ? { createdDate: { $gt: sinceDate } } : {}),
	};

	const [messages, readState] = await Promise.all([
		db
			.collection<ChatMessage>('chats')
			.find(filter)
			.sort({ createdDate: 1 })
			.limit(200)
			.toArray(),
		db.collection<ChatReadState>('chatStates').findOne({
			gameId: gameObjectId,
			userId,
		}),
	]);

	return {
		messages: messages.map((msg) => ({
			id: msg._id.toString(),
			gameId: msg.gameId.toString(),
			side: msg.side,
			userId: msg.userId.toString(),
			message: msg.message,
			createdDateStr:
				msg.createdDate?.toISOString?.() ?? new Date().toISOString(),
		})),
		lastSeenAt: readState?.lastSeenAt?.toISOString() ?? null,
	};
});
