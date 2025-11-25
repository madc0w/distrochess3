export const de = {
	app: {
		title: 'DistroChess',
		subtitle: 'Spiele',
	},
	games: {
		title: 'DistroChess — Spiele',
		loading: 'Wird geladen...',
		create: 'Erstellen',
		whitePlaceholder: 'Weiß',
		blackPlaceholder: 'Schwarz',
		vs: 'gegen',
	},
	welcome: 'Willkommen bei DistroChess',
	signup: 'Registrieren',
	signin: 'Anmelden',
	signout: 'Abmelden',
	forgotPassword: 'Passwort vergessen?',
	resetPassword: 'Passwort zurücksetzen',
	name: 'Benutzername',
	email: 'E-Mail',
	password: 'Passwort',
	confirmPassword: 'Passwort bestätigen',
	enterName: 'Geben Sie Ihren Namen ein (öffentlich sichtbar)',
	enterEmail: 'Geben Sie Ihre E-Mail ein',
	enterPassword: 'Geben Sie Ihr Passwort ein (mind. 6 Zeichen)',
	enterNewPassword: 'Geben Sie Ihr neues Passwort ein (mind. 6 Zeichen)',
	enterPasswordAgain: 'Geben Sie Ihr Passwort erneut ein',
	passwordsMustMatch: 'Passwörter müssen übereinstimmen.',
	pleaseWait: 'Bitte warten...',
	noAccount: 'Noch kein Konto?',
	haveAccount: 'Bereits ein Konto?',
	distroChess: 'DistroChess',
	gamePlaceholder: 'Spielansicht kommt bald!',
	gameComingSoon: 'Das Schachspiel wird hier angezeigt.',
	yourTurn: 'Sie sind am Zug...',
	youAre: 'Sie sind',
	landing: {
		eyebrow: 'Verteiltes Schach, für Menschen und Enten',
		headline: 'Ein neues Spiel bei jedem Zug',
		description: `<p>DistroChess ist verteiltes Schach. Das bedeutet, dass Sie nicht ein einzelnes Spiel gegen eine einzelne Person spielen. Stattdessen spielen Sie viele Spiele gegen viele andere Benutzer. Es ist ein bisschen wie eine Simultanveranstaltung, aber anstatt dass viele Leute gegen einen einzelnen Gegner spielen, gibt es mehrere Spieler auf jeder Seite des Tisches.</p>
			<p>Nachdem Sie einen Zug gemacht haben, wird dieses Spiel wieder in die Warteschlange gestellt, damit ein anderer Benutzer die Möglichkeit hat zu antworten. In der Zwischenzeit erhalten Sie ein zufälliges Spiel aus der Warteschlange. Um zu vermeiden, dass Spieler gegen sich selbst spielen, spielt jeder Spieler immer auf derselben Seite eines bestimmten Spiels.</p>
			<p>Dieses Projekt ist die Wiedergeburt einer alten Idee, ursprünglich um 2008 Discochess genannt, 2019 neu gestartet und jetzt wieder 2025.</p>`,
		featureTitle1: 'Spiel-Warteschlange',
		featureCopy1:
			'DistroChess verbindet Sie automatisch mit den nächsten verfügbaren Spielen.',
		featureTitle2: 'Schnelle Züge',
		featureCopy2:
			'Jeder Zug wird dank der verteilten Engine, die das Brett antreibt, in unter einer Sekunde weltweit repliziert.',
		featureTitle3: 'Team-Chat',
		featureCopy3:
			'Sprechen Sie mit Ihren Teamkollegen auf derselben Seite über die integrierte Team-Chat-Funktion. Diskutieren Sie Strategie, teilen Sie Tipps oder feuern Sie sich gegenseitig an.',
		communityTag: 'Von Enten gebaut',
		ctaHint: 'Jetzt spielen!',
		languageLabel: 'Sprache',
	},
	leaderboard: {
		linkLabel: 'Rangliste',
		title: 'Rangliste',
		subtitle: 'Top-Spieler nach Punktzahl',
		rank: 'Rang',
		player: 'Spieler',
		score: 'Punktzahl',
		wins: 'Siege',
		losses: 'Niederlagen',
		draws: 'Unentschieden',
		memberSince: 'Mitglied seit',
		you: 'Sie',
		loading: 'Rangliste wird geladen...',
		noPlayers: 'Noch keine Spieler',
		backToGame: 'Zurück zum Spiel',
		backToHome: 'Zurück zur Startseite',
		timeAgo: {
			today: 'Heute',
			day: '{count} Tag',
			days: '{count} Tage',
			month: '{count} Monat',
			months: '{count} Monate',
			year: '{count} Jahr',
			years: '{count} Jahre',
		},
	},
	faq: {
		linkLabel: 'FAQ',
		ctaPrompt: 'Brauchen Sie mehr Details?',
		ctaLabel: 'Lesen Sie die FAQ',
		pageTitle: 'Häufig gestellte Fragen',
		intro:
			'Was ist DistroChess? Wie funktioniert es?<br/>Sie sind verwirrt und wollen jetzt Antworten. Sie sind hier richtig.',
		lastUpdated: 'Letzte Aktualisierung: November 2025',
		contactPrompt: `Immer noch verwirrt? Schreiben Sie eine E-Mail an <a href="mailto:support@distrochess.com">support@distrochess.com</a>, und wir werden uns mit den Antworten auf alle Geheimnisse des Lebens bei Ihnen melden. Außer über Enten. Damit können wir nicht helfen.`,
		backToGame: 'Zurück zu Ihrem Spiel',
		backToLanding: 'Zurück zur Startseite',
		items: [
			{
				question: 'Wie werden Spielpaarungen gemacht?',
				answer: `Es wird Ihnen ein Spiel präsentiert, in dem entweder:
					<ul style="margin: 1rem 0; padding-left: 1.5rem;">
						<li>Sie noch nicht gespielt haben, oder</li>
						<li>Sie für die aktuelle Seite spielen</li>
					</ul>
					 Wenn kein solches Spiel existiert, warten Sie darauf, dass eines verfügbar wird, wenn einer Ihrer Gegner einen Zug macht. Hin und wieder bekommen Sie stattdessen ein brandneues Spiel.`,
			},
			{
				question: 'Was passiert, wenn ich einen Zug beende?',
				answer:
					'Das nächste verfügbare Spiel wird Ihnen automatisch präsentiert, nachdem Sie Ihren Zug gemacht haben, sodass Sie ohne Verzögerung weiterspielen können. Wenn derzeit kein Spiel verfügbar ist, warten Sie, bis einer Ihrer Gegner einen Zug macht.',
			},
			{
				question: 'Wie werden Punktzahlen berechnet?',
				answer: `<p>Jeder Spieler beginnt mit einer Punktzahl von 1000. Wenn ein Spiel endet, werden die Punktzahlen aller teilnehmenden Spieler wie folgt angepasst:</p>
				<ul style="margin: 1rem 0; padding-left: 1.5rem;">
					<li>Im Falle eines Unentschiedens ändert sich nichts.</li>
					<li>Im Falle eines Gewinns erhält jeder Gewinner eine Anzahl von Punkten, die proportional zu seinem prozentualen Anteil an der Teilnahme am Spiel ist. Ebenso wird jedem Verlierer eine proportionale Anzahl von Punkten basierend auf seinem prozentualen Anteil an der Teilnahme abgezogen.</li>
				</ul>
				<p>Aber keine Sorge, wir lassen Ihre Punktzahl nicht unter Null fallen.</p>`,
			},
			{
				question:
					'Was ist, wenn niemand einen Zug machen möchte, zum Beispiel wenn die Position aussichtslos ist? Wie aufgeben?',
				answer: `Nach 48 Stunden Inaktivität in einem Spiel benachrichtigt das System zunächst alle Spieler auf der Seite, die am Zug ist. Wenn nach weiteren 24 Stunden immer noch niemand einen Zug gemacht hat, wird das Spiel automatisch aufgegeben und die Punkte entsprechend zugewiesen.`,
			},
			{
				question: 'Aber... warum?',
				answer:
					'Mir war langweilig, okay?<br/>Dies ist jetzt die dritte Iteration dieser Idee. Das letzte Mal war im Jahr 2019, und ich sah damals mehrere hundert Spieler sich anmelden. Mal sehen, ob diese Ente 2025 noch fliegen kann.',
			},
			{
				question: 'Dürfen Enten spielen? Kann ich Schach mit Enten spielen?',
				answer:
					'DistroChess heißt alle Vogelarten willkommen, solange sie nicht zu viel Ärger machen.',
			},
		],
	},
	authPage: {
		signinTitle: 'Melden Sie sich an, um weiterzuspielen.',
		signinSubtitle: 'Nehmen Sie Ihre verteilten Spiele sofort wieder auf.',
		signupTitle: 'Erstellen Sie Ihr DistroChess-Konto.',
		signupSubtitle:
			'Wir benötigen nur einen Namen, eine E-Mail und ein Passwort.',
		backHome: 'Zurück zur Startseite',
		forgotPasswordTitle: 'Müssen Sie Ihr Passwort zurücksetzen?',
		forgotPasswordSubtitle:
			'Geben Sie die E-Mail ein, die mit Ihrem Konto verknüpft ist, und wir senden Ihnen einen sicheren Link.',
		forgotPasswordCta: 'Reset-Link senden',
		forgotPasswordSuccessTitle: 'Überprüfen Sie Ihren Posteingang',
		forgotPasswordSuccessBody:
			'Wenn diese E-Mail registriert ist, erhalten Sie in Kürze einen Link zum Zurücksetzen des Passworts.',
		resetPasswordTitle: 'Erstellen Sie ein neues Passwort',
		resetPasswordSubtitle:
			'Wählen Sie ein neues Passwort, um wieder Zugriff auf Ihr DistroChess-Konto zu erhalten.',
		resetPasswordCta: 'Passwort aktualisieren',
		resetPasswordSuccessTitle: 'Passwort aktualisiert',
		resetPasswordSuccessBody:
			'Alles erledigt. Melden Sie sich mit Ihrem neuen Passwort an, um zurück aufs Brett zu kommen.',
		resetPasswordExpired:
			'Dieser Reset-Link ist ungültig oder abgelaufen. Fordern Sie unten einen neuen Link an.',
		backToSignin: 'Zurück zur Anmeldung',
	},

	close: 'Schließen',
	errors: {
		ERR_EMAIL_REQUIRED: 'E-Mail ist erforderlich',
		ERR_NAME_REQUIRED: 'Name ist erforderlich',
		ERR_PASSWORD_TOO_SHORT: 'Passwort muss mindestens 6 Zeichen lang sein.',
		ERR_EMAIL_REGISTERED: 'Diese E-Mail ist bereits registriert.',
		ERR_ACCOUNT_CREATION_FAILED:
			'Kontoerstellung fehlgeschlagen — bitte versuchen Sie es erneut.',
		ERR_JWT_SECRET_MISSING: 'Serverfehler (fehlende Konfiguration)',
		ERR_PASSWORD_REQUIRED: 'Passwort ist erforderlich.',
		ERR_INVALID_CREDENTIALS: 'Ungültige E-Mail oder Passwort.',
		ERR_SIGNIN_FAILED:
			'Anmeldung fehlgeschlagen — bitte versuchen Sie es erneut.',
		ERR_UNAUTHORIZED_NO_TOKEN:
			'Nicht autorisiert: Kein Authentifizierungstoken bereitgestellt',
		ERR_INVALID_AUTH_TOKEN: 'Ungültiges Authentifizierungstoken',
		ERR_FORGOT_PASSWORD_FAILED:
			'Wir konnten Ihre Anfrage nicht bearbeiten. Bitte versuchen Sie es in einem Moment erneut.',
		ERR_RESET_TOKEN_INVALID:
			'Dieser Reset-Link ist ungültig oder abgelaufen. Fordern Sie einen neuen an.',
		ERR_RESET_PASSWORD_FAILED:
			'Wir konnten Ihr Passwort nicht zurücksetzen. Bitte versuchen Sie es erneut.',
		ERR_GENERIC: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
	},
	winCongrats: 'Glückwunsch! Sie haben das Spiel gewonnen.',
	winScoreChange:
		'Aufgrund Ihrer Teilnahme an diesem Spiel ist Ihre Punktzahl von {prevScore} auf {newScore} gestiegen.',
	gameDrawn: 'Spiel unentschieden!',
	waitingForOpponent: 'Bitte warten Sie, bis ein Gegner einen Zug macht...',
	timeRemaining: 'Verbleibende Zeit',
	pass: 'Passen',
	offerDraw: 'Remis anbieten',
	drawOffer: {
		title: 'Remis anbieten?',
		message:
			'Sind Sie sicher, dass Sie ein Remis anbieten möchten? Wenn der nächste Gegner akzeptiert, endet dieses Spiel unentschieden. Keiner Seite werden Punkte zugewiesen.',
		confirm: 'Ja, Remis anbieten',
		cancel: 'Abbrechen',
	},
	drawOffered: {
		title: 'Remis angeboten',
		message: 'Ihr Gegner hat ein Remis angeboten.',
		accept: 'Remis akzeptieren',
		decline: 'Weiterspielen',
	},
	loadingGame: 'Spiel wird geladen...',
	noGameAvailable: 'Kein Spiel verfügbar',
	gameId: 'Spiel-ID',
	gameHistory: 'Spielverlauf',
	exitHistory: 'Verlauf verlassen',
	requestedGameNotFound:
		'Wir konnten dieses Spiel nicht finden. Ihr nächstes verfügbares Spiel wird stattdessen geladen.',
	requestedGameNotAvailable:
		'Dieses Spiel ist für Sie nicht verfügbar. Ihr nächstes verfügbares Spiel wird stattdessen geladen.',
	unknownPlayer: 'Unbekannt',
	moveBy: 'Zug gemacht von:',
	lastMoveBy: 'Letzter Zug von:',
	score: 'Punktzahl',
	teamChat: {
		button: 'Team-Chat',
		title: 'Team-Chat',
		subtitle:
			'Nur Teamkollegen auf Ihrer Seite können diese Nachrichten lesen.',
		placeholder: 'Also, was ist der Plan?',
		send: 'Senden',
		sending: 'Wird gesendet...',
		loading: 'Nachrichten werden geladen...',
		empty: 'Noch keine Nachrichten. Sagen Sie Hallo!',
		you: 'Sie',
		disabledHint:
			'Machen Sie einen Zug für diese Seite, um den Team-Chat freizuschalten.',
		emojiToggle: 'Emoji-Auswahl umschalten',
		loadError:
			'Chat konnte nicht geladen werden. Bitte versuchen Sie es erneut.',
		sendError:
			'Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
		moveNumberLabel: 'Zug {move}',
	},
	moveErrors: {
		notYourTurnTitle: 'Nicht Ihr Zug',
		notYourTurnMessage:
			'Ein anderer Spieler hat gerade gezogen. Ihr nächstes Spiel wird geladen...',
	},
	settings: {
		title: 'Benutzereinstellungen',
		subtitle: 'Aktualisieren Sie Ihr Profil und Ihre Einstellungen.',
		button: 'Einstellungen',
		save: 'Änderungen speichern',
		language: 'Sprache',
		signupDate: 'Anmeldedatum',
		readOnly: 'Nur lesen',
		updateSuccess: 'Einstellungen erfolgreich aktualisiert.',
		backToGames: 'Zurück zu den Spielen',
		duckQuestion: 'Wie fühlen Sie sich über Enten?',
		duckFavor: 'Dafür',
		duckOpposed: 'Dagegen',
		changePassword: 'Passwort ändern',
		changePasswordTitle: 'Passwort ändern',
		currentPassword: 'Aktuelles Passwort',
		newPassword: 'Neues Passwort',
		setNewPassword: 'Neues Passwort festlegen',
		cancel: 'Abbrechen',
		incorrectPassword: 'Falsches Passwort',
		passwordChanged: 'Passwort erfolgreich geändert.',
	},
	subscriptionPages: {
		common: {
			returnHome: 'Zurück zu DistroChess',
			genericError: 'Bitte versuchen Sie es später erneut.',
			missingUser: 'Fehlende Benutzerinformationen.',
			updateFailed: 'E-Mail-Einstellungen konnten nicht aktualisiert werden.',
		},
		unsubscribe: {
			title: 'Benachrichtigungseinstellungen aktualisiert',
			pending: 'Einen Moment, Ihre Einstellungen werden aktualisiert…',
			success:
				'Sie haben sich von automatischen Aufgabe-Erinnerungen abgemeldet. Sie können sich jederzeit unten wieder anmelden.',
			linkText: 'Wieder für Erinnerungen anmelden',
		},
		resubscribe: {
			title: 'Sie sind wieder angemeldet',
			pending: 'Ihr Abonnement wird wiederhergestellt…',
			success: 'Sie erhalten wieder automatische Aufgabe-Erinnerungen.',
			linkText: 'Wieder abmelden',
		},
	},
	emails: {
		welcome: {
			greeting: 'Hallo {name},',
			intro:
				'Vielen Dank, dass Sie DistroChess beigetreten sind — die schnellste Art, Distro-Spiele online zu spielen.',
			description:
				'Starten Sie ein Spiel, laden Sie Freunde ein und behalten Sie Ihre Live-Bewertung von jedem Gerät aus im Auge.',
			ctaText: 'Zurück zu DistroChess.com',
			footer: 'Bis bald auf dem Brett!',
		},
		passwordReset: {
			subject: 'Setzen Sie Ihr DistroChess-Passwort zurück',
			greeting: 'Hallo {name},',
			body: 'Verwenden Sie den sicheren Link unten, um ein neues Passwort zu wählen.',
			warning:
				'Dieser Link läuft in 60 Minuten ab. Ignorieren Sie diese E-Mail, wenn Sie keine Zurücksetzung angefordert haben.',
			ctaText: 'Passwort zurücksetzen',
			footer: 'Fragen? Antworten Sie einfach auf diese E-Mail.',
		},
	},
	languages: {
		de: 'Deutsch',
		en: 'Englisch (English)',
		fr: 'Französisch (Français)',
		es: 'Spanisch (Español)',
		jp: 'Japanisch (日本語)',
	},
	privacy: {
		linkLabel: 'Datenschutzerklärung',
		pageTitle: 'Datenschutzerklärung',
		lastUpdated: 'Letzte Aktualisierung: November 2025',
		contactPrompt: `Fragen zum Datenschutz? Schreiben Sie eine E-Mail an <a href="mailto:support@distrochess.com">support@distrochess.com</a>.`,
		backToGame: 'Zurück zu Ihrem Spiel',
		backToLanding: 'Zurück zur Startseite',
		sections: [
			{
				title: 'Informationen, die wir sammeln',
				content: `Wir sammeln Informationen, die Sie angeben, wenn Sie ein Konto erstellen, einschließlich Ihres Namens und Ihrer E-Mail-Adresse. Wir sammeln auch Spieldaten wie Züge, die Sie machen, Spiele, an denen Sie teilnehmen, und Ihre Punktzahl.`,
			},
			{
				title: 'Wie wir Ihre Informationen verwenden',
				content: `Wir verwenden Ihre Informationen, um unsere Dienste bereitzustellen und zu verbessern, einschließlich des Versendens von Benachrichtigungen über Ihre Spiele. Ihr Name ist für andere Spieler öffentlich sichtbar.`,
			},
			{
				title: 'Datenspeicherung und Sicherheit',
				content: `Wir speichern Ihre Daten sicher unter Verwendung branchenüblicher Praktiken. Ihr Passwort ist verschlüsselt und wir speichern es niemals im Klartext. Wir bewahren Ihre Daten auf, solange Ihr Konto aktiv ist.`,
			},
			{
				title: 'Weitergabe Ihrer Informationen',
				content: `<b>Wir verkaufen oder teilen Ihre persönlichen Informationen nicht mit Dritten.</b> Ihr Name ist für andere Spieler im Spiel sichtbar, aber Ihre E-Mail-Adresse bleibt privat.`,
			},
			{
				title: 'Ihre Rechte',
				content: `Sie können Ihre Kontoinformationen jederzeit über die Einstellungsseite aktualisieren. Sie können sich auch von E-Mail-Benachrichtigungen abmelden. Wenn Sie Ihr Konto löschen möchten, kontaktieren Sie uns bitte unter <a href="mailto:support@distrochess.com">support@distrochess.com</a>.`,
			},
			{
				title: 'Cookies und Tracking',
				content: `Wir verwenden wesentliche Cookies, um Ihre Sitzung aufrechtzuerhalten und Sie angemeldet zu halten. Wir verwenden keine Tracking-Cookies oder Analysen von Drittanbietern.`,
			},
			{
				title: 'Änderungen dieser Richtlinie',
				content: `Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Wir werden Sie über wesentliche Änderungen per E-Mail oder durch einen Hinweis auf unserer Website informieren.`,
			},
		],
	},
};

export type Translations = typeof de;
