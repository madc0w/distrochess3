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
	const apiKey = process.env.MAILJET_API_KEY;
	const secretKey = process.env.MAILJET_SECRET_KEY;

	if (!apiKey || !secretKey) {
		throw new Error(
			'Mailjet API credentials not configured. Please set MAILJET_API_KEY and MAILJET_SECRET_KEY in your .env file'
		);
	}

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
		console.error('Failed to send welcome email:', response.status, errorText);
		throw new Error(`Mailjet API error (${response.status}): ${errorText}`);
	}

	const result = await response.json();
	console.log('Welcome email sent successfully to:', user.email);
	console.log('Mailjet response:', JSON.stringify(result, null, 2));
}

let cachedWelcomeTemplate: string | null = null;

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
