export function translateServerError(errOrCode: any, translations: any) {
	// Try common locations for server-side error code
	const maybeCode =
		errOrCode &&
		(typeof errOrCode === 'string'
			? errOrCode
			: errOrCode.statusMessage ||
			  errOrCode.data?.statusMessage ||
			  errOrCode.code ||
			  errOrCode.error ||
			  errOrCode.message);

	if (!maybeCode)
		return (
			(translations?.errors && translations.errors.ERR_GENERIC) ||
			'An error occurred'
		);

	const key = String(maybeCode);
	if (translations?.errors && translations.errors[key])
		return translations.errors[key];
	// If it's a server code but missing translation, fall back to generic
	if (key.startsWith('ERR_'))
		return (translations?.errors && translations.errors.ERR_GENERIC) || key;
	// Otherwise return the message/string as-is
	return key;
}
