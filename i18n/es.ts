export const es = {
	app: {
		title: 'DistroChess',
		subtitle: 'Partidas',
	},
	games: {
		title: 'DistroChess — Partidas',
		loading: 'Cargando...',
		create: 'Crear',
		whitePlaceholder: 'Blancas',
		blackPlaceholder: 'Negras',
		vs: 'vs',
	},
	welcome: 'Bienvenido a DistroChess',
	signup: 'Registrarse',
	signin: 'Iniciar sesión',
	signout: 'Cerrar sesión',
	forgotPassword: '¿Olvidaste tu contraseña?',
	resetPassword: 'Restablecer contraseña',
	name: 'Nombre de usuario',
	email: 'Correo electrónico',
	password: 'Contraseña',
	confirmPassword: 'Confirmar contraseña',
	enterName: 'Ingresa tu nombre (visible públicamente)',
	enterEmail: 'Ingresa tu correo electrónico',
	enterPassword: 'Ingresa tu contraseña (mínimo 6 caracteres)',
	enterNewPassword: 'Ingresa tu nueva contraseña (mínimo 6 caracteres)',
	enterPasswordAgain: 'Vuelve a ingresar tu contraseña',
	passwordsMustMatch: 'Las contraseñas deben coincidir.',
	pleaseWait: 'Por favor espera...',
	noAccount: '¿No tienes una cuenta?',
	haveAccount: '¿Ya tienes una cuenta?',
	distroChess: 'DistroChess',
	gamePlaceholder: '¡Vista de juego próximamente!',
	gameComingSoon: 'El juego de ajedrez se mostrará aquí.',
	yourTurn: 'Es tu turno...',
	youAre: 'Eres',
	landing: {
		eyebrow: 'Ajedrez distribuido, para humanos y patos',
		headline: 'Una nueva partida en cada turno',
		description: `<p>DistroChess es ajedrez distribuido. Esto significa que no juegas una sola partida contra una sola persona. En cambio, juegas muchas partidas contra muchos otros usuarios. Es un poco como una simultánea, pero en lugar de que muchas personas jueguen contra un solo oponente, hay varios jugadores en cada lado de la mesa.</p>
		<p>Después de hacer un movimiento, esa partida se coloca de nuevo en la cola para que otro usuario tenga la oportunidad de responder. Mientras tanto, se te dará una partida aleatoria de la cola. Para evitar que los jugadores jueguen contra sí mismos, cada jugador siempre juega el mismo lado de una partida determinada.</p>
		<p>Este proyecto es la reencarnación de una vieja idea, originalmente llamada Discochess allá por 2008, relanzada en 2019 y ahora nuevamente en 2025.</p>`,
		featureTitle1: 'Cola de partidas',
		featureCopy1:
			'DistroChess te empareja automáticamente con las siguientes partidas disponibles.',
		featureTitle2: 'Turnos rápidos',
		featureCopy2:
			'Cada movimiento se replica en todo el mundo en menos de un segundo gracias al motor distribuido que impulsa el tablero.',
		featureTitle3: 'Chat de equipo',
		featureCopy3:
			'Habla con tus compañeros de equipo en el mismo lado usando la función de chat de equipo integrada. Discute estrategias, comparte consejos o simplemente anímense mutuamente.',
		communityTag: 'Construido por patos',
		ctaHint: '¡Empieza a jugar ahora!',
		languageLabel: 'Idioma',
	},
	leaderboard: {
		linkLabel: 'Tabla de posiciones',
		title: 'Tabla de posiciones',
		subtitle: 'Mejores jugadores por puntuación',
		rank: 'Rango',
		player: 'Jugador',
		score: 'Puntuación',
		wins: 'Victorias',
		losses: 'Derrotas',
		draws: 'Empates',
		memberSince: 'Miembro desde',
		you: 'Tú',
		loading: 'Cargando tabla de posiciones...',
		noPlayers: 'Aún no hay jugadores',
		backToGame: 'Volver al juego',
		backToHome: 'Volver al inicio',
		timeAgo: {
			today: 'Hoy',
			day: '{count} día',
			days: '{count} días',
			month: '{count} mes',
			months: '{count} meses',
			year: '{count} año',
			years: '{count} años',
		},
	},
	faq: {
		linkLabel: 'Preguntas frecuentes',
		ctaPrompt: '¿Necesitas más detalles?',
		ctaLabel: 'Lee las preguntas frecuentes',
		pageTitle: 'Preguntas frecuentes',
		intro:
			'¿Qué es DistroChess? ¿Cómo funciona?<br/>Estás confundido y quieres respuestas ahora. Has llegado al lugar correcto.',
		lastUpdated: 'Última actualización: Noviembre 2025',
		contactPrompt: `¿Todavía confundido? Envía un correo a <a href="mailto:support@distrochess.com">support@distrochess.com</a>, y te responderemos con las respuestas a todos los misterios de la vida. Excepto los patos. No podemos ayudar con eso.`,
		backToGame: 'Volver a tu juego',
		backToLanding: 'Volver al inicio',
		items: [
			{
				question: '¿Cómo se hacen los emparejamientos de partidas?',
				answer: `Se te presentará una partida en la que:
					<ul style="margin: 1rem 0; padding-left: 1.5rem;">
						<li>aún no hayas jugado, o</li>
						<li>estés jugando por el lado actual</li>
					</ul>
					 Si no existe tal partida, esperarás a que una esté disponible, cuando uno de tus oponentes haga un movimiento. De vez en cuando, podrías obtener una partida completamente nueva en su lugar.`,
			},
			{
				question: '¿Qué sucede cuando termino un movimiento?',
				answer:
					'La siguiente partida disponible se te presentará automáticamente después de hacer tu movimiento, para que puedas seguir jugando sin demora. Si no hay partidas disponibles actualmente, esperarás hasta que uno de tus oponentes haga un movimiento.',
			},
			{
				question: '¿Cómo se calculan las puntuaciones?',
				answer: `<p>Cada jugador comienza con una puntuación de 1000. Cuando se completa una partida, las puntuaciones de todos los jugadores participantes se ajustan así:</p>
				<ul style="margin: 1rem 0; padding-left: 1.5rem;">
					<li>En caso de empate, nada cambia.</li>
					<li>En caso de victoria, cada ganador recibe una cantidad de puntos añadida que es proporcional a su porcentaje de participación en la partida. Del mismo modo, cada perdedor tiene una cantidad proporcional de puntos deducida basándose en su porcentaje de participación.</li>
				</ul>
				<p>Pero no te preocupes, no dejaremos que tu puntuación caiga por debajo de cero.</p>`,
			},
			{
				question:
					'¿Qué pasa si nadie quiere hacer un movimiento, por ejemplo si la posición es desesperada? ¿Cómo renunciar?',
				answer: `Después de 48 horas de inactividad en una partida, el sistema primero notificará a todos los jugadores del lado que debe mover. Si aún nadie ha hecho un movimiento después de otras 24 horas, entonces la partida se abandonará automáticamente y los puntos se asignarán en consecuencia.`,
			},
			{
				question: 'Simplemente... ¿por qué?',
				answer:
					'Estaba aburrido, ¿vale?<br/>Esta es ahora la tercera iteración de esta idea. La última vez fue en 2019, y vi a varios cientos de jugadores registrarse en ese entonces. Veamos si este pato todavía puede volar en 2025.',
			},
			{
				question:
					'¿Se permite que los patos jueguen? ¿Puedo jugar ajedrez con patos?',
				answer:
					'DistroChess da la bienvenida a todas las especies aviares, siempre que no causen demasiados problemas.',
			},
		],
	},
	authPage: {
		signinTitle: 'Inicia sesión para seguir jugando.',
		signinSubtitle: 'Recupera tus partidas distribuidas al instante.',
		signupTitle: 'Crea tu cuenta de DistroChess.',
		signupSubtitle: 'Solo necesitamos un nombre, correo y contraseña.',
		backHome: 'Volver al inicio',
		forgotPasswordTitle: '¿Necesitas restablecer tu contraseña?',
		forgotPasswordSubtitle:
			'Ingresa el correo asociado a tu cuenta y te enviaremos un enlace seguro.',
		forgotPasswordCta: 'Enviar enlace de restablecimiento',
		forgotPasswordSuccessTitle: 'Revisa tu bandeja de entrada',
		forgotPasswordSuccessBody:
			'Si ese correo está registrado, recibirás un enlace para restablecer la contraseña en breve.',
		resetPasswordTitle: 'Crea una nueva contraseña',
		resetPasswordSubtitle:
			'Elige una nueva contraseña para recuperar el acceso a tu cuenta de DistroChess.',
		resetPasswordCta: 'Actualizar contraseña',
		resetPasswordSuccessTitle: 'Contraseña actualizada',
		resetPasswordSuccessBody:
			'Todo listo. Inicia sesión con tu nueva contraseña para volver al tablero.',
		resetPasswordExpired:
			'Ese enlace de restablecimiento no es válido o ha expirado. Solicita un nuevo enlace abajo.',
		backToSignin: 'Volver a iniciar sesión',
	},

	close: 'Cerrar',
	errors: {
		ERR_EMAIL_REQUIRED: 'El correo electrónico es obligatorio',
		ERR_NAME_REQUIRED: 'El nombre es obligatorio',
		ERR_PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres.',
		ERR_EMAIL_REGISTERED: 'Ese correo electrónico ya está registrado.',
		ERR_NAME_REGISTERED: 'Ese nombre de usuario ya está en uso.',
		ERR_ACCOUNT_CREATION_FAILED:
			'La creación de cuenta falló — por favor intenta de nuevo.',
		ERR_JWT_SECRET_MISSING: 'Error del servidor (configuración faltante)',
		ERR_PASSWORD_REQUIRED: 'La contraseña es obligatoria.',
		ERR_INVALID_CREDENTIALS: 'Correo electrónico o contraseña inválidos.',
		ERR_SIGNIN_FAILED:
			'El inicio de sesión falló — por favor intenta de nuevo.',
		ERR_UNAUTHORIZED_NO_TOKEN:
			'No autorizado: No se proporcionó token de autenticación',
		ERR_INVALID_AUTH_TOKEN: 'Token de autenticación inválido',
		ERR_FORGOT_PASSWORD_FAILED:
			'No pudimos procesar tu solicitud. Por favor intenta de nuevo en un momento.',
		ERR_RESET_TOKEN_INVALID:
			'Ese enlace de restablecimiento no es válido o ha expirado. Solicita uno nuevo.',
		ERR_RESET_PASSWORD_FAILED:
			'No pudimos restablecer tu contraseña. Por favor intenta de nuevo.',
		ERR_GENERIC: 'Ocurrió un error. Por favor intenta de nuevo.',
	},
	winCongrats: '¡Felicitaciones! Has ganado la partida.',
	winScoreChange:
		'Debido a tu participación en esta partida, tu puntuación ha aumentado de {prevScore} a {newScore}.',
	gameDrawn: '¡Partida empatada!',
	waitingForOpponent:
		'Por favor espera a que un oponente haga un movimiento...',
	timeRemaining: 'Tiempo restante',
	pass: 'Pasar',
	offerDraw: 'Ofrecer empate',
	drawOffer: {
		title: '¿Ofrecer empate?',
		message:
			'¿Estás seguro de que quieres ofrecer un empate?<br/>La partida solo se ofrecerá a los oponentes que ya han jugado en ella. Si el siguiente oponente acepta, entonces esta partida quedará empatada y no se asignarán puntos a ningún lado.',
		confirm: 'Sí, ofrecer un empate',
		cancel: 'Mejor no',
	},
	drawOffered: {
		title: '¡Empate ofrecido!',
		message: 'Tu oponente ha ofrecido un empate.',
		accept: 'Aceptar empate',
		decline: 'Rechazar y seguir jugando',
	},
	loadingGame: 'Cargando partida...',
	noGameAvailable: 'No hay partida disponible',
	gameId: 'ID de partida',
	gameHistory: 'Historial de partida',
	exitHistory: 'Salir del historial',
	requestedGameNotFound:
		'No pudimos encontrar esa partida. Cargando tu siguiente partida disponible en su lugar.',
	requestedGameNotAvailable:
		'Esa partida no está disponible para ti. Cargando tu siguiente partida disponible en su lugar.',
	unknownPlayer: 'Desconocido',
	moveBy: 'Movimiento realizado por:',
	lastMoveBy: 'Último movimiento por:',
	score: 'Puntuación',
	teamChat: {
		button: 'Chat de equipo',
		title: 'Chat de equipo',
		subtitle: 'Solo los compañeros de tu lado pueden leer estos mensajes.',
		placeholder: '¿Entonces cuál es el plan?',
		send: 'Enviar',
		sending: 'Enviando...',
		loading: 'Cargando mensajes...',
		empty: '¡Aún no hay mensajes. Di hola!',
		you: 'Tú',
		disabledHint:
			'Haz un movimiento para este lado para desbloquear el chat de equipo.',
		emojiToggle: 'Alternar selector de emojis',
		loadError: 'No se pudo cargar el chat. Por favor intenta de nuevo.',
		sendError: 'No se pudo enviar tu mensaje. Por favor intenta de nuevo.',
		moveNumberLabel: 'Movimiento {move}',
	},
	moveErrors: {
		notYourTurnTitle: 'No es tu turno',
		notYourTurnMessage:
			'Otro jugador acaba de mover. Cargando tu siguiente partida...',
	},
	settings: {
		title: 'Configuración de usuario',
		subtitle: 'Actualiza tu perfil y preferencias.',
		button: 'Configuración',
		save: 'Guardar cambios',
		language: 'Idioma',
		signupDate: 'Fecha de registro',
		readOnly: 'Solo lectura',
		updateSuccess: 'Configuración actualizada exitosamente.',
		backToGames: 'Volver a las partidas',
		duckQuestion: '¿Cómo te sientes acerca de los patos?',
		duckFavor: 'A favor',
		duckOpposed: 'En contra',
		changePassword: 'Cambiar contraseña',
		changePasswordTitle: 'Cambiar contraseña',
		currentPassword: 'Contraseña actual',
		newPassword: 'Nueva contraseña',
		setNewPassword: 'Establecer nueva contraseña',
		cancel: 'Cancelar',
		incorrectPassword: 'Contraseña incorrecta',
		passwordChanged: 'Contraseña cambiada exitosamente.',
	},
	subscriptionPages: {
		common: {
			returnHome: 'Volver a DistroChess',
			genericError: 'Por favor intenta de nuevo más tarde.',
			missingUser: 'Falta información del usuario.',
			updateFailed: 'No se pudo actualizar tus preferencias de correo.',
		},
		unsubscribe: {
			title: 'Preferencias de notificación actualizadas',
			pending: 'Espera un momento, actualizando tus preferencias…',
			success:
				'Te has desuscrito de los recordatorios de abandono automático. Siempre puedes volver a suscribirte abajo.',
			linkText: 'Volver a suscribirse a los recordatorios',
		},
		resubscribe: {
			title: 'Estás suscrito de nuevo',
			pending: 'Restaurando tu suscripción…',
			success:
				'Comenzarás a recibir recordatorios de abandono automático de nuevo.',
			linkText: 'Desuscribirse de nuevo',
		},
	},
	emails: {
		welcome: {
			greeting: 'Hola {name},',
			intro:
				'Gracias por unirte a DistroChess — la forma más rápida de jugar partidas de estilo distribuido en línea.',
			description:
				'Comienza una partida, invita amigos y mantén un ojo en tu clasificación en vivo desde cualquier dispositivo.',
			ctaText: 'Vuelve a DistroChess.com',
			footer: '¡Nos vemos en el tablero!',
		},
		passwordReset: {
			subject: 'Restablece tu contraseña de DistroChess',
			greeting: 'Hola {name},',
			body: 'Usa el enlace seguro a continuación para elegir una nueva contraseña.',
			warning:
				'Este enlace expira en 60 minutos. Ignora este correo si no solicitaste un restablecimiento.',
			ctaText: 'Restablecer contraseña',
			footer: '¿Preguntas? Simplemente responde a este correo.',
		},
	},
	languages: {
		en: 'Inglés (English)',
		fr: 'Francés (Français)',
		de: 'Alemán (Deutsch)',
		es: 'Español',
		jp: 'Japonés (日本語)',
	},
	privacy: {
		linkLabel: 'Política de privacidad',
		pageTitle: 'Política de privacidad',
		lastUpdated: 'Última actualización: Noviembre 2025',
		contactPrompt: `¿Preguntas sobre tu privacidad? Envía un correo a <a href="mailto:support@distrochess.com">support@distrochess.com</a>.`,
		backToGame: 'Volver a tu juego',
		backToLanding: 'Volver al inicio',
		sections: [
			{
				title: 'Información que recopilamos',
				content: `Recopilamos información que proporcionas cuando creas una cuenta, incluyendo tu nombre y dirección de correo electrónico. También recopilamos datos del juego como los movimientos que realizas, las partidas en las que participas y tu puntuación.`,
			},
			{
				title: 'Cómo usamos tu información',
				content: `Usamos tu información para proporcionar y mejorar nuestros servicios, incluyendo enviarte notificaciones sobre tus partidas. Tu nombre es visible públicamente para otros jugadores.`,
			},
			{
				title: 'Almacenamiento y seguridad de datos',
				content: `Almacenamos tus datos de forma segura utilizando prácticas estándar de la industria. Tu contraseña está cifrada y nunca la almacenamos en texto plano. Retenemos tus datos mientras tu cuenta esté activa.`,
			},
			{
				title: 'Compartir tu información',
				content: `<b>No vendemos ni compartimos tu información personal con terceros.</b> Tu nombre es visible para otros jugadores en el juego, pero tu dirección de correo electrónico permanece privada.`,
			},
			{
				title: 'Tus derechos',
				content: `Puedes actualizar la información de tu cuenta en cualquier momento a través de la página de configuración. También puedes cancelar la suscripción a las notificaciones por correo electrónico. Si deseas eliminar tu cuenta, contáctanos en <a href="mailto:support@distrochess.com">support@distrochess.com</a>.`,
			},
			{
				title: 'Cookies y seguimiento',
				content: `Usamos cookies esenciales para mantener tu sesión y mantener tu sesión iniciada. No usamos cookies de seguimiento ni análisis de terceros.`,
			},
			{
				title: 'Cambios a esta política',
				content: `Podemos actualizar esta política de privacidad de vez en cuando. Te notificaremos cualquier cambio importante por correo electrónico o mediante un aviso en nuestro sitio web.`,
			},
		],
	},
};

export type Translations = typeof es;
