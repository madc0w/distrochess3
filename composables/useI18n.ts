function interpolate(str: string, vars: Record<string, any>): string {
	return str.replace(/\{(\w+)\}/g, (_, key) =>
		vars[key] !== undefined ? vars[key] : `{${key}}`
	);
}

import { en } from '~/i18n/en';
function makeTranslations(obj: any): any {
	return new Proxy(obj, {
		get(target, prop) {
			const value = target[prop as keyof typeof target];
			return (vars?: Record<string, any>) => {
				if (typeof value === 'string') {
					if (vars && typeof vars === 'object') {
						return interpolate(value, vars);
					}
					return value;
				}
				return value;
			};
		},
	});
}

function wrapTranslations(obj: any): any {
	return new Proxy(obj, {
		get(target, prop) {
			if (!(prop in target)) return prop;
			const value = target[prop as keyof typeof target];
			if (typeof value === 'string') {
				if (/\{\w+\}/.test(value)) {
					return (vars?: Record<string, any>) => {
						if (vars && typeof vars === 'object') {
							return interpolate(value, vars);
						}
						return value;
					};
				}
				return value;
			}
			if (typeof value === 'object' && value !== null) {
				return wrapTranslations(value);
			}
			return value;
		},
	});
}

export const translations = wrapTranslations(en);
