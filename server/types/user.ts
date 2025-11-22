import type { ObjectId } from 'mongodb';

export interface UserDoc {
	email: string;
	name: string;
	passwordHash: string;
	createdDate: Date | null;
	score: number;
	wins?: ObjectId[];
	losses?: ObjectId[];
	draws?: ObjectId[];
	preferredLocale?: string;
	unsubscribeDate?: Date | null;
	resetPasswordToken?: string | null;
	resetPasswordExpires?: Date | null;
}

export interface PublicUser extends Omit<UserDoc, 'passwordHash'> {
	_id: string;
}
