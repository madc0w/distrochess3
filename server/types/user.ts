export interface UserDoc {
	email: string;
	name: string;
	passwordHash: string;
	createdAt: Date;
}

export interface PublicUser {
	_id: string;
	email: string;
	name: string;
}
