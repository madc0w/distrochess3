import type { ObjectId } from 'mongodb';
import type { Game } from '../types/game';
import { includesId } from './includesId';

export function getPlayerSide(
	game: Game,
	userId: ObjectId
): 'white' | 'black' | null {
	if (includesId(game.whiteUserIds, userId)) {
		return 'white';
	}
	if (includesId(game.blackUserIds, userId)) {
		return 'black';
	}
	return null;
}
