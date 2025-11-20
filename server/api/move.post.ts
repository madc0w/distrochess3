import { Chess } from 'chess.js';
import { defineEventHandler, readBody } from 'h3';
import { ObjectId } from 'mongodb';
import type { Game } from '../types/game';
import { verifyAuthToken } from '../utils/auth';
import { includesId } from '../utils/includesId';
import { getDb } from '../utils/mongo';
import { updateUserScores } from '../utils/scores';

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
		`move posted for game ${
			game.id
		} by user ${userId.toHexString()}: ${JSON.stringify(move)}`
	);

	// Verify it's the user's turn
	const lastHistoryEntry = game.history[game.history.length - 1];
	const chessGame = new Chess(lastHistoryEntry.fen);

	if (game.currentTurnUserId?.toString() !== userId.toString()) {
		throw new Error('Not your turn');
	}

	// Validate and make the move
	const moveResult: any = chessGame.move(move);
	if (!moveResult) {
		throw new Error('Invalid move');
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
	if (moveResult.color === 'w' && !includesId(game.whiteUserIds, userId)) {
		pushFields.whiteUserIds = userId;
	} else if (
		moveResult.color === 'b' &&
		!includesId(game.blackUserIds, userId)
	) {
		pushFields.blackUserIds = userId;
	}

	// console.log('typeof chessGame.isGameOver', typeof chessGame.isGameOver);
	// console.log(
	// 	'typeof chessGame.game_over',
	// 	typeof (chessGame as any).game_over
	// );

	// Determine if the move ended the game and who (if anyone) won
	const isGameOver = chessGame.isGameOver(); // contrary to docs...
	const winnerColor = chessGame.isCheckmate() // contrary to docs...
		? (moveResult.color as 'w' | 'b')
		: null;

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

	let result: any = {};
	// If the game is over, refresh the game doc and update user scores
	if (isGameOver) {
		const updatedGame = await db
			.collection<Game>('games')
			.findOne({ _id: new ObjectId(gameId as string) });
		if (updatedGame) {
			const user = await db.collection('users').findOne({ _id: userId });
			await updateUserScores(db, updatedGame, winnerColor);
			result.gameResult = updatedGame.result;
			result.prevScore = user?.score;
			const reloadedUser = await db
				.collection('users')
				.findOne({ _id: userId });
			result.newScore = reloadedUser?.score;
		}
	}

	return { success: true, fen: newFen, result };
});
