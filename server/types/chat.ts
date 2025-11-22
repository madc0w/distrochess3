import { ObjectId } from 'mongodb';

export interface ChatMessage {
	_id: ObjectId;
	gameId: ObjectId;
	side: 'white' | 'black';
	userId: ObjectId;
	message: string;
	createdDate: Date;
}

export interface ChatReadState {
	_id: ObjectId;
	gameId: ObjectId;
	userId: ObjectId;
	lastSeenAt: Date;
}
