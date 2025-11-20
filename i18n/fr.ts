import type { Translations } from './en';

export const fr: Translations = {
	app: {
		title: 'DistroChess',
		subtitle: 'Jeux',
	},
	games: {
		title: 'DistroChess — Jeux',
		loading: 'Chargement...',
		create: 'Créer',
		whitePlaceholder: 'Blancs',
		blackPlaceholder: 'Noirs',
		vs: 'contre',
	},
	welcome: 'Bienvenue à DistroChess',
	signup: "S'inscrire",
	signin: 'Se connecter',
	signout: 'Se déconnecter',
	name: 'Nom',
	email: 'Email',
	password: 'Mot de passe',
	enterName: 'Entrez votre nom',
	enterEmail: 'Entrez votre email',
	enterPassword: 'Entrez votre mot de passe (min 6 caractères)',
	pleaseWait: 'Veuillez patienter...',
	noAccount: "Vous n'avez pas de compte?",
	haveAccount: 'Vous avez déjà un compte?',
	distroChess: 'DistroChess',
	gamePlaceholder: 'Vue du jeu à venir!',
	gameComingSoon: "Le jeu d'échecs sera affiché ici.",
	yourTurn: "C'est à vous de jouer...",
	waitingForOpponent: "Veuillez attendre qu'un adversaire joue...",
	timeRemaining: 'Temps restant',
	loadingGame: 'Chargement du jeu...',
	noGameAvailable: 'Aucun jeu disponible',
	gameId: 'ID de la partie',
	gameHistory: 'Historique de la partie',

	// Server error codes (dereference these on the client)
	errors: {
		ERR_EMAIL_REQUIRED: "L'email est requis",
		ERR_NAME_REQUIRED: 'Le nom est requis',
		ERR_PASSWORD_TOO_SHORT:
			'Le mot de passe doit contenir au moins 6 caractères',
		ERR_EMAIL_REGISTERED: 'Cet email est déjà utilisé',
		ERR_ACCOUNT_CREATION_FAILED:
			"La création du compte a échoué — réessayez s'il vous plaît",
		ERR_JWT_SECRET_MISSING: 'Erreur serveur (configuration manquante)',
		ERR_PASSWORD_REQUIRED: 'Le mot de passe est requis',
		ERR_INVALID_CREDENTIALS: 'Email ou mot de passe invalide',
		ERR_SIGNIN_FAILED: "Échec de la connexion — réessayez s'il vous plaît",
		ERR_UNAUTHORIZED_NO_TOKEN:
			"Non autorisé : jeton d'authentification manquant",
		ERR_INVALID_AUTH_TOKEN: "Jeton d'authentification invalide",
		ERR_GENERIC: 'Une erreur est survenue. Veuillez réessayer.',
	},
};
