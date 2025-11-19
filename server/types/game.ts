import { ObjectId } from 'mongodb';

export interface Game {
	_id: ObjectId;
	whiteUserIds: ObjectId[];
	blackUserIds: ObjectId[];
	fen: string;
	createdDate: Date;
	lastMoveDate?: Date;
	currentTurnUserId?: ObjectId | null;
	currentTurnStartDate?: Date | null;
}
