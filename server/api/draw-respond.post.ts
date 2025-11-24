import { createError, defineEventHandler, readBody } from 'h3';
import { ObjectId } from 'mongodb';
import type { Game } from '../types/game';
import { verifyAuthToken } from '../utils/auth';
import { getDb } from '../utils/mongo';
import { updateUserScores } from '../utils/scores';

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);
	const body = await readBody(event);
	const { gameId, accept } = body;

	if (!gameId || accept === undefined || !userId) {
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

	// Verify it's the user's turn and there's a draw offer
	if (game.currentTurnUserId?.toString() !== userId.toString()) {
		throw createError({ statusCode: 409, statusMessage: 'ERR_NOT_YOUR_TURN' });
	}

	if (!game.drawOfferUserId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'ERR_NO_DRAW_OFFER',
		});
	}

	if (accept) {
		// Accept draw - set game result to draw and update scores
		await db.collection<Game>('games').updateOne(
			{ _id: new ObjectId(gameId as string) },
			{
				$set: {
					result: 'draw',
					currentTurnUserId: null,
					currentTurnStartDate: null,
					drawOfferUserId: null,
				},
			}
		);

		// Update user scores for draw
		const updatedGame = await db
			.collection<Game>('games')
			.findOne({ _id: new ObjectId(gameId as string) });
		if (updatedGame) {
			await updateUserScores(db, updatedGame, null);
		}

		return { success: true, result: 'draw' };
	} else {
		// Decline draw - just clear the draw offer
		await db.collection<Game>('games').updateOne(
			{ _id: new ObjectId(gameId as string) },
			{
				$set: {
					drawOfferUserId: null,
				},
			}
		);

		return { success: true, result: 'declined' };
	}
});
