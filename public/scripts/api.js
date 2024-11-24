import { BACKEND_URL } from "./config.js";

class API {
	/**
	 * 
	 * @param {string} path 
	 * @param {object} data 
	 * @param {string} method 
	 */
	async #fetchAuth(path, data, method) {
		let headers = {
			"Content-Type": "application/json",
		};
		const token = localStorage.getItem('token');
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		// TODO: differentiate 4xx/5xx responses from network error
		const response = await fetch(
			BACKEND_URL + path,
			{
				method,
				headers,
				body: JSON.stringify(data),
			}
		);

		return await response.json();
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