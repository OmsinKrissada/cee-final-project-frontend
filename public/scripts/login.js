import { BACKEND_URL } from "./config.js";

const sp = new URLSearchParams(window.location.search);
const { token } = await fetch(BACKEND_URL + '/auth/login/discord', {
	method: 'POST',
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({ code: sp.get('code'), redirect_uri: window.location.origin + '/redirect' })
}).then(r => r.json());

console.log(`token is ${token}`);
if (token) {
	localStorage.setItem('token', token);
}
window.location.replace('/');