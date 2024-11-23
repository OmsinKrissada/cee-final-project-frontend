import { BACKEND_URL } from "./config.js";

class API {
	/**
	 * 
	 * @param {string} path 
	 * @param {object} data 
	 * @param {string} method 
	 */
	#fetchAuth(path, data, method) {
		let headers = {
			"Content-Type": "application/json",
		};
		const token = localStorage.getItem('token');
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
			console.log(`token exists ${JSON.stringify(headers)}`);
		}
		return fetch(
			BACKEND_URL + path,
			{
				method,
				headers,
				body: JSON.stringify(data),
			}
		).then(r => r.json());
	}

	/**
	 * @param {string} path 
	 * @param {object} data 
	 */
	get = (path, data) => this.#fetchAuth(path, data, 'GET');
	/**
	 * @param {string} path 
	 * @param {object} data 
	 */
	post = (path, data) => this.#fetchAuth(path, data, 'POST');
	/**
	 * @param {string} path 
	 * @param {object} data 
	 */
	put = (path, data) => this.#fetchAuth(path, data, 'PUT');
	/**
	 * @param {string} path 
	 * @param {object} data 
	 */
	delete = (path, data) => this.#fetchAuth(path, data, 'DELETE');
}

export default new API();