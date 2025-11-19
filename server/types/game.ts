import { ObjectId } from 'mongodb';

export interface Game {
	_id: ObjectId;
	id: Number;
	whiteUserIds: ObjectId[];
	blackUserIds: ObjectId[];
	history: Array<{
		fen: string;
		date: Date;
		userId: ObjectId | null;
	}>;
	createdDate: Date;
	lastMoveDate?: Date | null;
	currentTurnUserId?: ObjectId | null;
	currentTurnStartDate?: Date | null;
}
