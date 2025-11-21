export interface UserDoc {
	email: string;
	name: string;
	passwordHash: string;
	createdDate: Date | null;
	score: number;
	preferredLocale?: string;
}

export interface PublicUser extends Omit<UserDoc, 'passwordHash'> {
	_id: string;
}
