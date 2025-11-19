import { Chess } from 'chess.js';
import { defineEventHandler, readBody } from 'h3';
import { ObjectId } from 'mongodb';
import type { Game } from '../types/game';
import { verifyAuthToken } from '../utils/auth';
import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	const userId = verifyAuthToken(event);
	const body = await readBody(event);
	const { gameId, move } = body;

	if (!gameId || !move || !userId) {
		throw new Error('move.post: Missing gameId, move, and/or userId');
	}

	const db = await getDb();
	const game = await db
		.collection<Game>('games')
		.findOne({ _id: new ObjectId(gameId as string) });

	if (!game) {
		throw new Error('Game not found');
	}
	console.log(
		`move posted for game ${gameId} by user ${userId.toHexString()}: ${JSON.stringify(
			move
		)}`
	);

	// Verify it's the user's turn
	const lastHistoryEntry = game.history[game.history.length - 1];
	const chessGame = new Chess(lastHistoryEntry.fen);

	if (game.currentTurnUserId?.toString() !== userId.toString()) {
		throw new Error('Not your turn');
	}

	// Validate and make the move
	let moveResult: any;
	try {
		moveResult = chessGame.move(move);
		if (!moveResult) {
			throw new Error('Invalid move');
		}
	} catch (error) {
		throw new Error('Invalid move: ' + (error as Error).message);
	}

	// Add to game history and record which user moved (white or black)
	const newFen = chessGame.fen();
	const now = new Date();

	const pushFields: any = {
		history: {
			fen: newFen,
			date: now,
			userId,
		},
	};

	// moveResult.color is 'w' for white, 'b' for black
	if (moveResult.color === 'w') {
		pushFields.whiteUserIds = userId;
	} else {
		pushFields.blackUserIds = userId;
	}

	await db.collection<Game>('games').updateOne(
		{ _id: new ObjectId(gameId as string) },
		{
			$push: pushFields as any,
			$set: {
				lastMoveDate: now,
				currentTurnUserId: null,
				currentTurnStartDate: null,
			},
		}
	);

	return { success: true, fen: newFen };
});
