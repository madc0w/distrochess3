import { getTranslations } from '../../i18n/index';
import type { UserDoc } from '../types/user';

interface MailjetMessage {
	From: {
		Email: string;
		Name: string;
	};
	To: [
		{
			Email: string;
			Name: string;
		}
	];
	Subject: string;
	TextPart?: string;
	HTMLPart?: string;
}

interface MailjetPayload {
	Messages: MailjetMessage[];
}

export async function sendWelcomeEmail(
	user: UserDoc,
	locale: string = 'en'
): Promise<void> {
	const t = getTranslations(locale);
	const userName = user.name;
	const emailCopy = t.emails.welcome;

	const greeting = emailCopy.greeting.replace('{name}', userName);

	const subject = t.welcome;
	const textBody = `${t.welcome} ${userName}! ${emailCopy.description}`;
	// Load HTML template bundled via Nitro server assets
	const htmlTemplate = await loadWelcomeTemplate();
	const replacements: Record<string, string> = {
		'{{welcomeHeading}}': t.welcome,
		'{{greeting}}': greeting,
		'{{welcomeMessage}}': emailCopy.intro,
		'{{descriptionMessage}}': emailCopy.description,
		'{{ctaText}}': emailCopy.ctaText,
		'{{footerMessage}}': emailCopy.footer,
	};

	const htmlBody = Object.entries(replacements).reduce(
		(acc, [token, value]) => acc.replaceAll(token, value),
		htmlTemplate
	);

	const payload: MailjetPayload = {
		Messages: [
			{
				From: {
					Email: 'support@distrochess.com',
					Name: 'DistroChess',
				},
				To: [
					{
						Email: user.email,
						Name: userName,
					},
				],
				Subject: subject,
				TextPart: textBody,
				HTMLPart: htmlBody,
			},
		],
	};

	await sendMail(payload, `welcome email to ${user.email}`);
}

export async function sendPasswordResetEmail(
	user: UserDoc,
	resetUrl: string,
	locale: string = 'en'
): Promise<void> {
	const t = getTranslations(locale);
	const copy = t.emails.passwordReset;
	const name = user.name || user.email;
	const greeting = copy.greeting.replace('{name}', name);

	const htmlTemplate = await loadPasswordResetTemplate();
	const replacements: Record<string, string> = {
		'{{resetHeading}}': copy.subject,
		'{{greeting}}': greeting,
		'{{resetMessage}}': copy.body,
		'{{ctaText}}': copy.ctaText,
		'{{ctaUrl}}': resetUrl,
		'{{warningMessage}}': copy.warning,
		'{{footerMessage}}': copy.footer,
	};

	const htmlBody = Object.entries(replacements).reduce(
		(acc, [token, value]) => acc.replaceAll(token, value),
		htmlTemplate
	);

	const textBody = [
		greeting,
		'',
		copy.body,
		copy.warning,
		'',
		`${copy.ctaText}: ${resetUrl}`,
		copy.footer,
	]
		.filter(Boolean)
		.join('\n');

	const payload: MailjetPayload = {
		Messages: [
			{
				From: {
					Email: 'support@distrochess.com',
					Name: 'DistroChess',
				},
				To: [
					{
						Email: user.email,
						Name: name,
					},
				],
				Subject: copy.subject,
				TextPart: textBody,
				HTMLPart: htmlBody,
			},
		],
	};

	await sendMail(payload, `password reset email to ${user.email}`);
}

let cachedWelcomeTemplate: string | null = null;
let cachedPasswordResetTemplate: string | null = null;

async function loadWelcomeTemplate(): Promise<string> {
	if (cachedWelcomeTemplate) {
		return cachedWelcomeTemplate;
	}

	const storage = useStorage('assets:server');
	const rawTemplate = await storage.getItem('email-templates/welcome.html');
	if (!rawTemplate) {
		throw new Error(
			'Missing email template "welcome.html" in server/assets/email-templates.'
		);
	}

	let template: string;
	if (typeof rawTemplate === 'string') {
		template = rawTemplate;
	} else if (rawTemplate instanceof Uint8Array) {
		template = Buffer.from(rawTemplate).toString('utf8');
	} else if (rawTemplate instanceof ArrayBuffer) {
		template = Buffer.from(rawTemplate).toString('utf8');
	} else {
		template = String(rawTemplate);
	}

	cachedWelcomeTemplate = template;
	return template;
}

async function loadPasswordResetTemplate(): Promise<string> {
	if (cachedPasswordResetTemplate) {
		return cachedPasswordResetTemplate;
	}

	const storage = useStorage('assets:server');
	const rawTemplate = await storage.getItem(
		'email-templates/password-reset.html'
	);
	if (!rawTemplate) {
		throw new Error(
			'Missing email template "password-reset.html" in server/assets/email-templates.'
		);
	}

	let template: string;
	if (typeof rawTemplate === 'string') {
		template = rawTemplate;
	} else if (rawTemplate instanceof Uint8Array) {
		template = Buffer.from(rawTemplate).toString('utf8');
	} else if (rawTemplate instanceof ArrayBuffer) {
		template = Buffer.from(rawTemplate).toString('utf8');
	} else {
		template = String(rawTemplate);
	}

	cachedPasswordResetTemplate = template;
	return template;
}

async function sendMail(
	payload: MailjetPayload,
	context: string
): Promise<void> {
	const apiKey = process.env.MAILJET_API_KEY;
	const secretKey = process.env.MAILJET_SECRET_KEY;

	if (!apiKey || !secretKey) {
		throw new Error(
			'Mailjet API credentials not configured. Please set MAILJET_API_KEY and MAILJET_SECRET_KEY in your .env file'
		);
	}

	const response = await fetch('https://api.mailjet.com/v3.1/send', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization:
				'Basic ' + Buffer.from(`${apiKey}:${secretKey}`).toString('base64'),
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error(`Failed to send ${context}:`, response.status, errorText);
		throw new Error(`Mailjet API error (${response.status}): ${errorText}`);
	}

	const result = await response.json();
	const recipients = payload.Messages.flatMap((message) =>
		message.To.map((to) => to.Email)
	);
	console.log(`Email sent (${context}) to:`, recipients.join(', '));
	console.log('Mailjet response:', JSON.stringify(result, null, 2));
}
