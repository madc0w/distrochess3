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
	forgotPassword: 'Forgot password?',
	resetPassword: 'Reset password',
	name: 'Username',
	email: 'Email',
	password: 'Password',
	confirmPassword: 'Confirm password',
	enterName: 'Enter your name (publicly visible)',
	enterEmail: 'Enter your email',
	enterPassword: 'Enter your password (min 6 characters)',
	enterNewPassword: 'Enter your new password (min 6 characters)',
	enterPasswordAgain: 'Re-enter your password',
	passwordsMustMatch: 'Passwords must match.',
	pleaseWait: 'Please wait...',
	noAccount: "Don't have an account?",
	haveAccount: 'Already have an account?',
	distroChess: 'DistroChess',
	gamePlaceholder: 'Game view coming soon!',
	gameComingSoon: 'The chess game will be displayed here.',
	yourTurn: "It's your move...",
	youAre: 'You are',
	landing: {
		eyebrow: 'Distributed chess, for humans and ducks',
		headline: 'Keep playing. Forever.',
		description:
			'Make a move, get a new game, make another move. Rinse and repeat.',
		featureTitle1: 'Game queue',
		featureCopy1:
			'DistroChess matches you with the next available games automatically.',
		featureTitle2: 'Snappy turns',
		featureCopy2:
			'Every move replicates worldwide in under a second thanks to the distributed engine powering the board.',
		featureTitle3: 'Team chat',
		featureCopy3:
			'Talk to your teammates on the same side using the built-in team chat feature. Discuss strategy, share tips, or just cheer each other on.',
		communityTag: 'Built by ducks',
		ctaHint: 'Start playing in seconds',
		languageLabel: 'Language',
	},
	leaderboard: {
		linkLabel: 'Leaderboard',
		title: 'Leaderboard',
		subtitle: 'Top players by score',
		rank: 'Rank',
		player: 'Player',
		score: 'Score',
		memberSince: 'Member Since',
		you: 'You',
		loading: 'Loading leaderboard...',
		noPlayers: 'No players yet',
		backToGame: 'Back to game',
		backToHome: 'Back to home',
	},
	faq: {
		linkLabel: 'FAQ',
		ctaPrompt: 'Need more details?',
		ctaLabel: 'Read the FAQ',
		pageTitle: 'Frequently Asked Questions',
		intro:
			"What is DistroChess? How does it work?<br/>You're confused, and you want answers now. You've come to the right place.",
		lastUpdated: 'Last update: November 2025',
		contactPrompt: `Still confused? Email <a href="mailto:support@distrochess.com">support@distrochess.com</a>, and we'll get back to you with the answers to all of life's mysteries. Except for ducks. We can't help with that.`,
		backToGame: 'Back to your game',
		backToLanding: 'Back to home',
		items: [
			{
				question: 'How are game matches made?',
				answer: `You will be presented with a game in which either:
					<ul style="margin: 1rem 0; padding-left: 1.5rem;">
						<li>you haven't played yet, or</li>
						<li>you are playing for the current side</li>
					</ul>
					 If no such game exists, you will wait for one to become available, when one of your opponents makes a move. Once in a while, you might get a fresh new game instead.`,
			},
			{
				question: 'What happens when I finish a move?',
				answer:
					'The next available game will be presented to you automatically after you make your move, so you can keep playing without delay. If no game is currently available, you will wait until one of your opponents makes a move.',
			},
			{
				question: 'How are scores calculated?',
				answer: `<p>Each player begins with a score of 1000. When a game completes, scores for all participating players are adjusted like this:</p>
				<ul style="margin: 1rem 0; padding-left: 1.5rem;">
					<li>In the case of a draw, nothing changes.</li>
					<li>In the case of a win, each winner gets a number of points added which is proportional to their percentage of participation in the game. Likewise, each loser a proportional number of points deducted based on their percentage of participation.</li>
				</ul>
				<p>But don't worry, we won't let your score go below zero.</p>`,
			},
			{
				question:
					'What if nobody wants to make a move, for example if position is hopeless? How to resign?',
				answer: `After 48 hours of inactivity in a game, the system will first notify all players on the side to move. If still nobody has made a move after another 24 hours, then the game will be auto-resigned, and points allocated accordingly.`,
			},
			{
				question: 'Just... why?',
				answer:
					"I was bored, OK?<br/>This is now the third iteration of this idea. The last time was back in 2019, and I saw several hundred players sign up back then. Let's see if this duck can still fly in 2025.",
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
		forgotPasswordTitle: 'Need to reset your password?',
		forgotPasswordSubtitle:
			"Enter the email tied to your account and we'll send a secure link.",
		forgotPasswordCta: 'Send reset link',
		forgotPasswordSuccessTitle: 'Check your inbox',
		forgotPasswordSuccessBody:
			"If that email is registered, you'll get a password reset link shortly.",
		resetPasswordTitle: 'Create a new password',
		resetPasswordSubtitle:
			'Choose a new password to regain access to your DistroChess account.',
		resetPasswordCta: 'Update password',
		resetPasswordSuccessTitle: 'Password updated',
		resetPasswordSuccessBody:
			"You're all set. Sign in with your new password to get back on the board.",
		resetPasswordExpired:
			'That reset link is invalid or has expired. Request a new link below.',
		backToSignin: 'Back to sign in',
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
		ERR_FORGOT_PASSWORD_FAILED:
			"We couldn't process your request. Please try again in a moment.",
		ERR_RESET_TOKEN_INVALID:
			'That reset link is invalid or has expired. Request a new one.',
		ERR_RESET_PASSWORD_FAILED:
			"We couldn't reset your password. Please try again.",
		ERR_GENERIC: 'An error occurred. Please try again.',
	},
	winCongrats: "Congratulations! You've won the game.",
	winScoreChange:
		'Due to your participation in this game, your score has increased from {prevScore} to {newScore}.',
	gameDrawn: 'Game drawn!',
	waitingForOpponent: 'Please wait for an opponent to make a move...',
	timeRemaining: 'Time remaining',
	pass: 'Pass',
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
		moveNumberLabel: 'Move {move}',
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
		duckQuestion: 'How do you feel about ducks?',
		duckFavor: 'In favor',
		duckOpposed: 'Opposed',
		changePassword: 'Change password',
		changePasswordTitle: 'Change Password',
		currentPassword: 'Current password',
		newPassword: 'New password',
		setNewPassword: 'Set new password',
		cancel: 'Cancel',
		incorrectPassword: 'Incorrect password',
		passwordChanged: 'Password changed successfully.',
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
		passwordReset: {
			subject: 'Reset your DistroChess password',
			greeting: 'Hi {name},',
			body: 'Use the secure link below to pick a new password.',
			warning:
				'This link expires in 60 minutes. Ignore this email if you did not request a reset.',
			ctaText: 'Reset password',
			footer: 'Questions? Just reply to this email.',
		},
	},
	languages: {
		en: 'English',
		fr: 'French (Français)',
	},
	privacy: {
		linkLabel: 'Privacy Policy',
		pageTitle: 'Privacy Policy',
		lastUpdated: 'Last update: November 2025',
		contactPrompt: `Questions about your privacy? Email <a href="mailto:support@distrochess.com">support@distrochess.com</a>.`,
		backToGame: 'Back to your game',
		backToLanding: 'Back to home',
		sections: [
			{
				title: 'Information We Collect',
				content: `We collect information you provide when you create an account, including your name and email address. We also collect game data such as moves you make, games you participate in, and your score.`,
			},
			{
				title: 'How We Use Your Information',
				content: `We use your information to provide and improve our services, including sending you  notifications about your games. Your name is publicly visible to other players.`,
			},
			{
				title: 'Data Storage and Security',
				content: `We store your data securely using industry-standard practices. Your password is encrypted and we never store it in plain text. We retain your data as long as your account is active.`,
			},
			{
				title: 'Sharing Your Information',
				content: `<b>We do not sell or share your personal information with any third parties.</b> Your name is visible to other players in the game, but your email address remains private.`,
			},
			{
				title: 'Your Rights',
				content: `You can update your account information at any time through the settings page. You can also unsubscribe from email notifications. If you wish to delete your account, please contact us at <a href="mailto:support@distrochess.com">support@distrochess.com</a>.`,
			},
			{
				title: 'Cookies and Tracking',
				content: `We use essential cookies to maintain your session and keep you signed in. We do not use tracking cookies or third-party analytics.`,
			},
			{
				title: 'Changes to This Policy',
				content: `We may update this privacy policy from time to time. We will notify you of any material changes by email or through a notice on our website.`,
			},
		],
	},
};

export type Translations = typeof en;
