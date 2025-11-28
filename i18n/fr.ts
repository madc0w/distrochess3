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
	forgotPassword: 'Mot de passe oublié ?',
	resetPassword: 'Réinitialiser le mot de passe',
	name: 'Nom',
	email: 'Email',
	password: 'Mot de passe',
	confirmPassword: 'Confirmez le mot de passe',
	enterName: 'Entrez votre nom (visible publiquement)',
	enterEmail: 'Entrez votre email',
	enterPassword: 'Entrez votre mot de passe (min 6 caractères)',
	enterNewPassword: 'Entrez votre nouveau mot de passe (min 6 caractères)',
	enterPasswordAgain: 'Saisissez de nouveau votre mot de passe',
	passwordsMustMatch: 'Les mots de passe doivent correspondre.',
	pleaseWait: 'Veuillez patienter...',
	noAccount: "Vous n'avez pas de compte?",
	haveAccount: 'Vous avez déjà un compte?',
	distroChess: 'DistroChess',
	gamePlaceholder: 'Vue du jeu à venir!',
	gameComingSoon: "Le jeu d'échecs sera affiché ici.",
	yourTurn: "C'est à vous de jouer...",
	youAre: 'Vous êtes',
	landing: {
		eyebrow: 'Échecs distribués, pour les humains et les canards',
		headline: 'Un nouveau jeu à chaque tour',
		description: `<p>DistroChess, c'est les échecs distribués. Cela signifie que vous ne jouez pas une seule partie contre une seule personne. Au lieu de cela, vous jouez plusieurs parties contre plusieurs autres utilisateurs. C'est un peu comme une simultanée, mais au lieu de plusieurs personnes jouant contre un seul adversaire, il y a plusieurs joueurs de chaque côté de la table.</p>
			<p>Après avoir effectué un coup, cette partie est remise dans la file d'attente afin qu'un autre utilisateur puisse avoir l'occasion de répondre. Pendant ce temps, vous recevrez une partie aléatoire de la file d'attente. Pour éviter que les joueurs ne jouent contre eux-mêmes, chaque joueur joue toujours du même côté pour une partie donnée.</p>
			<p>Ce projet est la réincarnation d'une ancienne idée, initialement nommée Discochess vers 2008, relancée en 2019, et maintenant à nouveau en 2025.</p>`,
		featureTitle1: 'File de parties',
		featureCopy1:
			'DistroChess vous associe automatiquement aux prochaines parties disponibles.',
		featureTitle2: 'Coups instantanés',
		featureCopy2:
			"Chaque coup se réplique dans le monde en moins d'une seconde grâce au moteur distribué qui alimente le plateau.",
		featureTitle3: "Chat d'équipe",
		featureCopy3:
			"Parlez à vos coéquipiers du même côté en utilisant la fonctionnalité de chat d'équipe intégrée. Discutez de stratégie, partagez des conseils ou encouragez-vous mutuellement.",
		communityTag: 'Construit par des canards',
		ctaHint: 'Commencez à jouer maintenant !',
		languageLabel: 'Langue',
	},
	leaderboard: {
		linkLabel: 'Classement',
		title: 'Classement',
		subtitle: 'Meilleurs joueurs par score',
		rank: 'Rang',
		player: 'Joueur',
		score: 'Score',
		wins: 'Victoires',
		losses: 'Défaites',
		draws: 'Parties nulles',
		memberSince: 'Membre depuis',
		you: 'Vous',
		loading: 'Chargement du classement...',
		noPlayers: 'Aucun joueur pour le moment',
		backToGame: 'Retour au jeu',
		backToHome: "Retour à l'accueil",
		timeAgo: {
			today: "Aujourd'hui",
			day: '{count} jour',
			days: '{count} jours',
			month: '{count} mois',
			months: '{count} mois',
			year: '{count} an',
			years: '{count} ans',
		},
	},
	faq: {
		linkLabel: 'FAQ',
		ctaPrompt: 'Besoin de plus de détails ?',
		ctaLabel: 'Lire la FAQ',
		pageTitle: 'Questions fréquentes',
		intro:
			"Qu'est-ce que DistroChess ? Comment ça fonctionne ?<br/>Vous êtes un peu perdu et voulez des réponses maintenant. Vous êtes au bon endroit.",
		lastUpdated: 'Dernière mise à jour : novembre 2025',
		contactPrompt:
			'Toujours perdu ? Écrivez à <a href="mailto:support@distrochess.com">support@distrochess.com</a>, et nous vous répondrons pour éclaircir tous les mystères de la vie. Sauf les canards. Là, on ne peut rien faire.',
		backToGame: 'Retour à votre partie',
		backToLanding: 'Retour à l’accueil',
		items: [
			{
				question: 'Comment les parties sont-elles appariées ?',
				answer:
					"Nous vous proposons une partie dans laquelle soit vous n'avez encore jamais joué, soit vous jouez pour la couleur dont c'est le tour. S'il n'existe aucune partie répondant à ces critères, vous patienterez jusqu'à ce qu'une se libère, lorsqu'un de vos adversaires jouera. De temps à autre, vous recevrez peut-être une nouvelle partie toute fraîche.",
			},
			{
				question: 'Que se passe-t-il quand je termine un coup ?',
				answer:
					'La prochaine partie disponible vous est présentée automatiquement pour que vous puissiez continuer sans attendre. S’il n’y en a aucune, vous patienterez jusqu’à ce qu’un de vos adversaires joue.',
			},
			{
				question: 'Comment les scores sont-ils calculés ?',
				answer:
					'Chaque joueur commence avec un score de 1000. Quand une partie se termine, les scores de tous les participants sont ajustés ainsi : en cas de partie nulle, rien ne change. En cas de victoire, chaque gagnant gagne un nombre de points proportionnel à son pourcentage de participation. Chaque perdant perd le même nombre de points, calculé selon son pourcentage de participation.',
			},
			{
				question:
					'Et si personne ne veut jouer, par exemple si la position est désespérée ? Comment abandonner ?',
				answer:
					"Après 48 heures d'inactivité, le système prévient d'abord tous les joueurs du camp au trait. Si personne ne joue après 24 heures supplémentaires, la partie est abandonnée automatiquement et les points sont attribués en conséquence.",
			},
			{
				question:
					'Les canards peuvent-ils jouer ? Puis-je jouer aux échecs avec des canards ?',
				answer:
					"DistroChess accepte tous les participants à plumes, tant qu'ils ne causent pas trop de remous.",
			},
		],
	},
	authPage: {
		signinTitle: 'Connectez-vous pour continuer',
		signinSubtitle: 'Reprenez instantanément vos parties distribuées.',
		signupTitle: 'Créez votre compte DistroChess',
		signupSubtitle:
			"Nous avons seulement besoin d'un nom, d'un email et d'un mot de passe.",
		backHome: "Retour à l'accueil",
		forgotPasswordTitle: 'Besoin de réinitialiser votre mot de passe ?',
		forgotPasswordSubtitle:
			"Indiquez l'email associé à votre compte et nous vous enverrons un lien sécurisé.",
		forgotPasswordCta: 'Envoyer le lien de réinitialisation',
		forgotPasswordSuccessTitle: 'Vérifiez votre boîte mail',
		forgotPasswordSuccessBody:
			'Si cet email est enregistré, vous recevrez bientôt un lien de réinitialisation.',
		resetPasswordTitle: 'Créez un nouveau mot de passe',
		resetPasswordSubtitle:
			'Rentrer un nouveau mot de passe pour retrouver l’accès à votre compte.',
		resetPasswordCta: 'Mettre à jour le mot de passe',
		resetPasswordSuccessTitle: 'Mot de passe mis à jour',
		resetPasswordSuccessBody:
			'Vous pouvez maintenant vous reconnecter avec votre nouveau mot de passe.',
		resetPasswordExpired:
			'Ce lien est invalide ou expiré. Demandez un nouveau lien ci-dessous.',
		backToSignin: 'Retour à la connexion',
	},
	waitingForOpponent: "Veuillez attendre qu'un adversaire joue...",
	timeRemaining: 'Temps restant',
	pass: 'Passer',
	offerDraw: 'Proposer partie nulle',
	drawOffer: {
		title: 'Proposer partie nulle ?',
		message:
			'Êtes-vous sûr de vouloir proposer une partie nulle ? Si le prochain adversaire accepte, cette partie sera nulle. Aucun point ne sera attribué.',
		confirm: 'Oui, proposer la nulle',
		cancel: 'Annuler',
	},
	drawOffered: {
		title: 'Partie nulle proposé',
		message: 'Votre adversaire a proposé une partie nulle.',
		accept: 'Accepter',
		decline: 'Continuer à jouer',
	},
	loadingGame: 'Chargement du jeu...',
	noGameAvailable: 'Aucun jeu disponible',
	gameId: 'ID de la partie',
	requestedGameNotFound:
		"Nous n'avons pas trouvé cette partie. Chargement de votre prochaine partie disponible.",
	requestedGameNotAvailable:
		"Vous n'avez pas accès à cette partie. Chargement de votre prochaine partie disponible.",
	winCongrats: 'Félicitations ! Vous avez gagné la partie.',
	winScoreChange:
		'Grâce à votre participation à ce jeu, votre score est passé de {prevScore} à {newScore}.',
	noScoreChange:
		"Cette partie s'est terminée par en nulle. Tous les scores restent inchangés.",
	gameDrawn: 'Partie nulle !',
	gameHistory: 'Historique de la partie',
	exitHistory: "Quitter l'historique",
	unknownPlayer: 'Inconnu',
	moveBy: 'Coup joué par :',
	lastMoveBy: 'Dernier coup par :',
	score: 'Score',
	teamChat: {
		button: "Chat d'équipe",
		title: "Chat d'équipe",
		subtitle: 'Seuls vos coéquipiers de cette couleur voient ces messages.',
		placeholder: 'Alors, quel est le plan ?',
		send: 'Envoyer',
		sending: 'Envoi...',
		loading: 'Chargement des messages...',
		empty: 'Aucun message pour le moment. Lancez la discussion !',
		you: 'Vous',
		disabledHint:
			'Jouez un coup avec cette couleur pour activer le chat d’équipe.',
		emojiToggle: 'Afficher/masquer le sélecteur emoji',
		loadError: 'Impossible de charger le chat. Veuillez réessayer.',
		sendError: 'Impossible d’envoyer votre message. Veuillez réessayer.',
		moveNumberLabel: 'Coup {move}',
	},
	moveErrors: {
		notYourTurnTitle: 'Pas votre tour',
		notYourTurnMessage:
			'Un autre joueur vient de jouer. Chargement de votre prochaine partie...',
	},
	profile: {
		button: 'Profil',
		score: 'Score :',
		wins: 'Victoires :',
		losses: 'Défaites :',
		draws: 'Nulles :',
	},
	settings: {
		title: 'Paramètres utilisateur',
		subtitle: 'Mettez à jour votre profil et vos préférences.',
		button: 'Paramètres',
		save: 'Enregistrer les modifications',
		language: 'Langue',
		signupDate: "Date d'inscription",
		readOnly: 'Lecture seule',
		updateSuccess: 'Paramètres mis à jour avec succès.',
		backToGames: 'Retour au jeu',
		duckQuestion: 'Que pensez-vous des canards ?',
		duckFavor: 'En faveur',
		duckOpposed: 'Opposé',
		changePassword: 'Changer le mot de passe',
		changePasswordTitle: 'Changer le mot de passe',
		currentPassword: 'Mot de passe actuel',
		newPassword: 'Nouveau mot de passe',
		setNewPassword: 'Définir le nouveau mot de passe',
		cancel: 'Annuler',
		incorrectPassword: 'Mot de passe incorrect',
		passwordChanged: 'Mot de passe modifié avec succès.',
	},
	subscriptionPages: {
		common: {
			returnHome: 'Retourner sur DistroChess',
			genericError: 'Veuillez réessayer plus tard.',
			missingUser: 'Informations utilisateur manquantes.',
			updateFailed: 'Impossible de mettre à jour vos préférences e-mail.',
		},
		unsubscribe: {
			title: 'Préférences de notification mises à jour',
			pending: 'Un instant, nous mettons à jour vos préférences…',
			success:
				'Vous êtes désabonné des rappels d’abandon automatique. Vous pouvez vous réabonner ci-dessous.',
			linkText: 'Se réabonner aux rappels',
		},
		resubscribe: {
			title: 'Vous êtes à nouveau abonné',
			pending: 'Restauration de votre abonnement…',
			success: 'Vous recevrez de nouveau les rappels d’abandon automatique.',
			linkText: 'Se désabonner de nouveau',
		},
	},
	close: 'Fermer',
	emails: {
		welcome: {
			greeting: 'Bonjour {name},',
			intro:
				"Merci d'avoir rejoint DistroChess — la façon la plus rapide de jouer en ligne.",
			description:
				'Lancez une partie, invitez vos amis et suivez votre score en direct depuis n’importe quel appareil.',
			ctaText: 'Visiter DistroChess.com',
			footer: "À bientôt sur l'échiquier !",
		},
		passwordReset: {
			subject: 'Réinitialisez votre mot de passe DistroChess',
			greeting: 'Bonjour {name},',
			body: 'Utilisez le lien sécurisé ci-dessous pour choisir un nouveau mot de passe.',
			warning:
				"Ce lien expire dans 60 minutes. Ignorez ce message si vous n'êtes pas à l'origine de la demande.",
			ctaText: 'Réinitialiser le mot de passe',
			footer: 'Des questions ? Répondez tout simplement à cet email.',
		},
	},

	// Server error codes (dereference these on the client)
	errors: {
		ERR_EMAIL_REQUIRED: "L'email est requis",
		ERR_NAME_REQUIRED: 'Le nom est requis',
		ERR_PASSWORD_TOO_SHORT:
			'Le mot de passe doit contenir au moins 6 caractères',
		ERR_EMAIL_REGISTERED: 'Cet email est déjà utilisé',
		ERR_NAME_REGISTERED: "Ce nom d'utilisateur est déjà pris",
		ERR_ACCOUNT_CREATION_FAILED:
			"La création du compte a échoué — réessayez s'il vous plaît",
		ERR_JWT_SECRET_MISSING: 'Erreur serveur (configuration manquante)',
		ERR_PASSWORD_REQUIRED: 'Le mot de passe est requis',
		ERR_INVALID_CREDENTIALS: 'Email ou mot de passe invalide',
		ERR_SIGNIN_FAILED: "Échec de la connexion — réessayez s'il vous plaît",
		ERR_UNAUTHORIZED_NO_TOKEN:
			"Non autorisé : jeton d'authentification manquant",
		ERR_INVALID_AUTH_TOKEN: "Jeton d'authentification invalide",
		ERR_FORGOT_PASSWORD_FAILED:
			'Impossible de traiter votre demande. Veuillez réessayer dans un instant.',
		ERR_RESET_TOKEN_INVALID:
			'Ce lien de réinitialisation est invalide ou expiré. Demandez-en un nouveau.',
		ERR_RESET_PASSWORD_FAILED:
			'Impossible de réinitialiser votre mot de passe. Veuillez réessayer.',
		ERR_GENERIC: 'Une erreur est survenue. Veuillez réessayer.',
	},
	languages: {
		fr: 'Français',
		en: 'Anglais (English)',
		de: 'Allemand (Deutsch)',
		es: 'Espagnol (Español)',
		jp: 'Japonais (日本語)',
	},
	contact: {
		linkLabel: 'Contact',
	},
	privacy: {
		linkLabel: 'Politique de confidentialité',
		pageTitle: 'Politique de confidentialité',
		lastUpdated: 'Dernière mise à jour : novembre 2025',
		contactPrompt: `Des questions sur votre vie privée ? Écrivez à <a href="mailto:support@distrochess.com">support@distrochess.com</a>.`,
		backToGame: 'Retour à votre partie',
		backToLanding: "Retour à l'accueil",
		sections: [
			{
				title: 'Informations que nous collectons',
				content: `Nous collectons les informations que vous fournissez lors de la création de votre compte, notamment votre nom et votre adresse e-mail. Nous collectons également les données de jeu telles que les coups que vous jouez, les parties auxquelles vous participez et votre score.`,
			},
			{
				title: 'Comment nous utilisons vos informations',
				content: `Nous utilisons vos informations pour fournir et améliorer nos services, notamment pour vous associer à des parties, calculer les scores et vous envoyer des notifications importantes concernant vos parties. Votre nom est visible publiquement par les autres joueurs.`,
			},
			{
				title: 'Stockage et sécurité des données',
				content: `Nous stockons vos données de manière sécurisée en utilisant des pratiques conformes aux normes de l'industrie. Votre mot de passe est crypté et nous ne le stockons jamais en texte clair. Nous conservons vos données tant que votre compte est actif.`,
			},
			{
				title: 'Partage de vos informations',
				content: `Nous ne vendons ni ne partageons vos informations personnelles avec des tiers. Votre nom est visible par les autres joueurs dans le jeu, mais votre adresse e-mail reste privée.`,
			},
			{
				title: 'Vos droits',
				content: `Vous pouvez mettre à jour les informations de votre compte à tout moment via la page des paramètres. Vous pouvez également vous désabonner des notifications par e-mail. Si vous souhaitez supprimer votre compte, veuillez nous contacter à <a href="mailto:support@distrochess.com">support@distrochess.com</a>.`,
			},
			{
				title: 'Cookies et suivi',
				content: `Nous utilisons des cookies essentiels pour maintenir votre session et vous garder connecté. Nous n'utilisons pas de cookies de suivi ni d'analyses tierces.`,
			},
			{
				title: 'Modifications de cette politique',
				content: `Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement important par e-mail ou via un avis sur notre site Web.`,
			},
		],
	},
};
