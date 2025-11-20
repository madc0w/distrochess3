export interface UserDoc {
	email: string;
	name: string;
	passwordHash: string;
	createdDate: Date;
	score: number;
}

export interface PublicUser {
	_id: string;
	email: string;
	name: string;
	score: number;
}
