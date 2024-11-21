/**
 * 
 * @param {string | URL | globalThis.Request} input 
 * @param {RequestInit} init 
 */
export function fetchAuth(input, init) {
	return fetch(
		input,
		{
			headers: {
				"Authorization": `Bearer ${localStorage.getItem('token')}`,
				"Content-Type": "application/json",
				...init?.headers,
			},
			...init
		}
	);
}

/**
 * 
 * @param {string | URL | globalThis.Request} input 
 * @param {RequestInit} init 
 */
export function fetchNormal(input, init) {
	return fetch(
		input,
		{
			headers: {
				"Authorization": `Bearer ${localStorage.getItem('token')}`,
				"Content-Type": "application/json",
				...init?.headers,
			},
			...init
		}
	);
}