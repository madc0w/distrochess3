import { createError, defineEventHandler, readBody } from 'h3';
import { ObjectId } from 'mongodb';
import type { ChatMessage } from '../types/chat';
import type { Game } from '../types/game';
import { verifyAuthToken } from '../utils/auth';
import { getPlayerSide } from '../utils/getPlayerSide';
import { getDb } from '../utils/mongo';

const MAX_MESSAGE_LENGTH = 800;

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);
	const body = await readBody(event);
	const gameId = body?.gameId as string | undefined;
	const message = typeof body?.message === 'string' ? body.message.trim() : '';

	if (!gameId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_GAME_ID_REQUIRED',
		});
	}

	if (!message) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_MESSAGE_REQUIRED',
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

	const sanitizedMessage = message.slice(0, MAX_MESSAGE_LENGTH);
	const now = new Date();
	const moveNumber = Math.max(0, (game.history?.length ?? 1) - 1);

	const chatDoc: ChatMessage = {
		_id: new ObjectId(),
		gameId: gameObjectId,
		side,
		userId,
		message: sanitizedMessage,
		createdDate: now,
		moveNumber,
	};

	await db.collection<ChatMessage>('chats').insertOne(chatDoc);

	return {
		id: chatDoc._id.toString(),
		gameId: gameObjectId.toString(),
		side,
		userId: userId.toString(),
		message: sanitizedMessage,
		createdDateStr: now.toISOString(),
		moveNumber,
	};
});
