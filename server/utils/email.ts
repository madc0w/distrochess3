import { readFileSync } from 'fs';
import { join } from 'path';
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

	const subject = t.welcome;
	const textBody = `${t.welcome} ${userName}!`;
	// Load HTML template and replace placeholders
	// ESM-compatible directory resolution
	// ESM-compatible directory resolution (no require)
	// Always resolve path relative to project, not Nuxt build dir
	const templatePath = join(
		process.cwd(),
		'server',
		'utils',
		'email-templates',
		'welcome.html'
	);
	let htmlTemplate = readFileSync(templatePath, 'utf8');
	htmlTemplate = htmlTemplate
		.replace('{{welcome}}', t.welcome)
		.replace('{{userName}}', userName)
		.replace('{{welcomeMessage}}', `${userName}, ${t.welcome}`);

	const htmlBody = htmlTemplate;

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

	return result;
}
