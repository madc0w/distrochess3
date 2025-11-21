import type { Db } from 'mongodb';
import { ObjectId } from 'mongodb';
import { scoreFactor } from '../../constants/game';
import type { Game } from '../types/game';
import { includesId } from './includesId';

export async function updateUserScores(
	db: Db,
	game: Game,
	winnerColor: 'w' | 'b' | null
) {
	// Update game.result based on winnerColor
	if (winnerColor === 'w') {
		game.result = 'white-win';
	} else if (winnerColor === 'b') {
		game.result = 'black-win';
	} else {
		game.result = 'draw';
	}

	// Persist game.result to the database
	const gamesColl = db.collection('games');
	await gamesColl.updateOne(
		{ _id: new ObjectId(game._id) },
		{ $set: { result: game.result } }
	);

	if (winnerColor) {
		const usersColl = db.collection('users');
		const winnerIds =
			(winnerColor == 'w' ? game.whiteUserIds : game.blackUserIds) || [];

		const winnerMoveCounts: { [key: string]: number } = {};
		const loserMoveCounts: { [key: string]: number } = {};
		for (const h of game.history) {
			const id: string | null = h.userId?.toString() || null;
			if (id) {
				if (includesId(winnerIds, h.userId)) {
					if (!winnerMoveCounts[id]) {
						winnerMoveCounts[id] = 0;
					}
					winnerMoveCounts[id]++;
				} else {
					if (!loserMoveCounts[id]) {
						loserMoveCounts[id] = 0;
					}
					loserMoveCounts[id]++;
				}
			}
		}

		for (const userId in winnerMoveCounts) {
			const scoreChange =
				(scoreFactor * winnerMoveCounts[userId]) / game.history.length;
			await usersColl.updateOne(
				{ _id: new ObjectId(userId) },
				{ $inc: { score: scoreChange } }
			);
		}
		for (const userId in loserMoveCounts) {
			const scoreChange =
				(scoreFactor * loserMoveCounts[userId]) / game.history.length;
			// Ensure score does not go below 0
			const user = await usersColl.findOne({ _id: new ObjectId(userId) });
			const newScore = Math.max(0, (user?.score ?? 0) - scoreChange);
			await usersColl.updateOne(
				{ _id: new ObjectId(userId) },
				{ $set: { score: newScore } }
			);
		}
	}
}

export default updateUserScores;
