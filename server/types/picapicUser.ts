export interface PicapicUser {
	userId: string;
	isSignedIn: boolean;
	ipAddress: string | null;
	numTrials: number;
	firstActiveDate: Date;
	lastActiveDate: Date;
}
