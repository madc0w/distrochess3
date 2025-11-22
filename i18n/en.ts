export const en = {
	app: {
		title: 'DistroChess',
		subtitle: 'Games',
	},
	games: {
		title: 'DistroChess — Games',
		loading: 'Loading...',
		create: 'Create',
		whitePlaceholder: 'White',
		blackPlaceholder: 'Black',
		vs: 'vs',
	},
	welcome: 'Welcome to DistroChess',
	signup: 'Sign Up',
	signin: 'Sign In',
	signout: 'Sign Out',
	name: 'Name',
	email: 'Email',
	password: 'Password',
	enterName: 'Enter your name (publicly visible)',
	enterEmail: 'Enter your email',
	enterPassword: 'Enter your password (min 6 characters)',
	pleaseWait: 'Please wait...',
	noAccount: "Don't have an account?",
	haveAccount: 'Already have an account?',
	distroChess: 'DistroChess',
	gamePlaceholder: 'Game view coming soon!',
	gameComingSoon: 'The chess game will be displayed here.',
	yourTurn: "It's your move...",
	youAre: 'You are',
	landing: {
		eyebrow: 'Async chess for builders',
		headline: 'Chess that keeps pace with your team.',
		description:
			'DistroChess coordinates distributed matches, live ratings, and async moves so teams can play whenever time zones align.',
		featureTitleOne: 'Global ladder',
		featureCopyOne:
			'Queue into one persistent ladder and let DistroChess match you with the next best opponent automatically.',
		featureTitleTwo: 'Snappy turns',
		featureCopyTwo:
			'Every move replicates worldwide in under a second thanks to the distributed engine powering the board.',
		featureTitleThree: 'Insightful analytics',
		featureCopyThree:
			'Understand streaks, openings, and score deltas with built-in telemetry tuned for async play.',
		communityTag: 'Built by the DistroChess community',
		ctaHint: 'Start playing in seconds',
	},
	faq: {
		linkLabel: 'FAQ',
		ctaPrompt: 'Need more details?',
		ctaLabel: 'Read the FAQ',
		pageTitle: 'Frequently Asked Questions',
		intro:
			"What is DistroChess? How does it work?<br/>You're confused, and you want answers now. You've come to the right place.",
		lastUpdated: 'Last updated November 2025',
		contactPrompt: `Still confused? Email <a href="mailto:support@distrochess.com">support@distrochess.com</a>, and we'll get back to you with the answers to all of life's mysteries. Except for ducks. We can't help with that.`,
		backToGame: 'Back to your game',
		backToLanding: 'Back to home',
		items: [
			{
				question: 'How are game matches made?',
				answer:
					'You will be presented with a game in which either you have never played, or you are playing on the side whose turn it is. If no such game exists, you will wait for one to become available, when one of your oppoenents makes a move. Once in a while, you might get a fresh new game instead.',
			},
			{
				question: 'What happens when I finish a move?',
				answer:
					'The next available game will be presented to you automatically, so you can keep playing without delay. If no game is currently available, you will wait until one of your opponents makes a move.',
			},
			{
				question: 'How are scores calculated?',
				answer: `Each player begins with a score of 1000. When a game completes, scores for all participating players are adjusted like this: In the case of a draw, nothing changes. In the case of a win, each winner gets a number of points added which is proprtional to their percentage of participation in the game. Likewise, each loser has the same number of points deducted based on their percentage of participation. But don't worry, we won't let your score go below zero.`,
			},
			{
				question:
					'What if nobody wants to make a move, for example if position is hopeless? How to resign?',
				answer: `After 48 hours of inactivity in a game, the system will first notify all players on the side to move. If still nobody has made a move after another 24 hours, then the game will be auto-resigned, and points allocated accordingly.`,
			},
			{
				question: 'Are ducks allowed to play? Can I play chess with ducks?',
				answer:
					"DistroChess welcomes all avian species, so long as they don't make too much trouble.",
			},
		],
	},
	authPage: {
		signinTitle: 'Sign in to keep playing.',
		signinSubtitle: 'Pick up your distributed matches instantly.',
		signupTitle: 'Create your DistroChess account.',
		signupSubtitle: 'We just need a name, email, and password.',
		backHome: 'Back to home',
	},

	close: 'Close',
	errors: {
		ERR_EMAIL_REQUIRED: 'Email is required',
		ERR_NAME_REQUIRED: 'Name is required',
		ERR_PASSWORD_TOO_SHORT: 'Password must be at least 6 characters.',
		ERR_EMAIL_REGISTERED: 'That email is already registered.',
		ERR_ACCOUNT_CREATION_FAILED: 'Account creation failed — please try again.',
		ERR_JWT_SECRET_MISSING: 'Server error (missing configuration)',
		ERR_PASSWORD_REQUIRED: 'Password is required.',
		ERR_INVALID_CREDENTIALS: 'Invalid email or password.',
		ERR_SIGNIN_FAILED: 'Sign in failed — please try again.',
		ERR_UNAUTHORIZED_NO_TOKEN: 'Unauthorized: No authentication token provided',
		ERR_INVALID_AUTH_TOKEN: 'Invalid authentication token',
		ERR_GENERIC: 'An error occurred. Please try again.',
	},
	winCongrats: "Congratulations! You've won the game.",
	winScoreChange:
		'Due to your participation in this game, your score has increased from {prevScore} to {newScore}.',
	gameDrawn: 'Game drawn!',
	waitingForOpponent: 'Please wait for an opponent to make a move...',
	timeRemaining: 'Time remaining',
	loadingGame: 'Loading game...',
	noGameAvailable: 'No game available',
	gameId: 'Game ID',
	gameHistory: 'Game history',
	requestedGameNotFound:
		"We couldn't find that game. Loading your next available game instead.",
	requestedGameNotAvailable:
		"That game isn't available to you. Loading your next available game instead.",
	unknownPlayer: 'Unknown',
	moveBy: 'Move made by:',
	lastMoveBy: 'Last move by:',
	score: 'Score',
	teamChat: {
		button: 'Team chat',
		title: 'Team chat',
		subtitle: 'Only teammates on your side can read these messages.',
		placeholder: 'Share your plan or encouragement...',
		send: 'Send',
		sending: 'Sending...',
		loading: 'Loading messages...',
		empty: 'No messages yet. Say hello!',
		you: 'You',
		disabledHint: 'Make a move for this side to unlock team chat.',
		emojiToggle: 'Toggle emoji picker',
		loadError: "Couldn't load chat. Please try again.",
		sendError: "Couldn't send your message. Please try again.",
	},
	moveErrors: {
		notYourTurnTitle: 'Not your turn',
		notYourTurnMessage: 'Another player just moved. Loading your next game...',
	},
	settings: {
		title: 'User Settings',
		subtitle: 'Update your profile and preferences.',
		button: 'Settings',
		save: 'Save changes',
		language: 'Language',
		signupDate: 'Sign up date',
		readOnly: 'Read only',
		updateSuccess: 'Settings updated successfully.',
		backToGames: 'Back to games',
	},
	subscriptionPages: {
		common: {
			returnHome: 'Return to DistroChess',
			genericError: 'Please try again later.',
			missingUser: 'Missing user information.',
			updateFailed: 'Unable to update your email preferences.',
		},
		unsubscribe: {
			title: 'Notification Preferences Updated',
			pending: 'Hang tight, updating your preferences…',
			success:
				"You're unsubscribed from auto-resign reminders. You can always re-subscribe below.",
			linkText: 'Re-subscribe to reminders',
		},
		resubscribe: {
			title: "You're Subscribed Again",
			pending: 'Restoring your subscription…',
			success: "You'll start receiving auto-resign reminders again.",
			linkText: 'Unsubscribe again',
		},
	},
	emails: {
		welcome: {
			greeting: 'Hi {name},',
			intro:
				'Thanks for joining DistroChess — the fastest way to play distro-style games online.',
			description:
				'Start a match, invite friends, and keep an eye on your live rating from any device.',
			ctaText: 'Jump back into DistroChess.com',
			footer: 'See you on the board!',
		},
	},
	languages: {
		en: 'English',
		fr: 'French (Français)',
	},
};

export type Translations = typeof en;
