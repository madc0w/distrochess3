import { ObjectId } from 'mongodb';

export interface Game {
	_id: ObjectId;
	white: string;
	black: string;
	whiteUserIds: ObjectId[];
	blackUserIds: ObjectId[];
	fen: string;
	createdDate: Date;
	lastMoveDate?: Date;
}
