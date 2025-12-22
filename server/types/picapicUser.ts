export interface PicapicUser {
	userId: string;
	isSignedIn: boolean;
	ipAddress: string | null;
	firstActiveDate: Date;
	lastActiveDate: Date;
}
