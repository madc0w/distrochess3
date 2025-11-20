/**
 * Checks if an array contains an element with the same string value as the given id.
 */
export function includesId(arr: any[] = [], id: any): boolean {
	return arr.some((x) => x != null && x.toString() === id.toString());
}
