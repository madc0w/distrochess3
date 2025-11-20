import type { Db } from 'mongodb';
import { ObjectId } from 'mongodb';
import type { Game } from '../types/game';
import { includesId } from './includesId';

export async function updateUserScores(
	db: Db,
	game: Game,
	winnerColor: 'w' | 'b' | null
) {
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
			const scoreChange = (20 * winnerMoveCounts[userId]) / game.history.length;
			await usersColl.updateOne(
				{ _id: new ObjectId(userId) },
				{ $inc: { score: scoreChange } }
			);
		}
		for (const userId in loserMoveCounts) {
			const scoreChange = (20 * loserMoveCounts[userId]) / game.history.length;
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
