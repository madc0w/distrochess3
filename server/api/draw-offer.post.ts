import { createError, defineEventHandler, readBody } from 'h3';
import { ObjectId } from 'mongodb';
import type { Game } from '../types/game';
import { verifyAuthToken } from '../utils/auth';
import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);
	const body = await readBody(event);
	const { gameId } = body;

	if (!gameId || !userId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_MISSING_FIELDS',
		});
	}

	const db = await getDb();
	const game = await db
		.collection<Game>('games')
		.findOne({ _id: new ObjectId(gameId as string) });

	if (!game) {
		throw createError({ statusCode: 404, statusMessage: 'GAME_NOT_FOUND' });
	}

	// Verify it's the user's turn
	if (game.currentTurnUserId?.toString() !== userId.toString()) {
		throw createError({ statusCode: 409, statusMessage: 'ERR_NOT_YOUR_TURN' });
	}

	// Set draw offer
	await db.collection<Game>('games').updateOne(
		{ _id: new ObjectId(gameId as string) },
		{
			$set: {
				drawOfferUserId: userId,
			},
		}
	);

	return { success: true };
});
