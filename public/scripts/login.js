import api from "./api.js";

const sp = new URLSearchParams(window.location.search);

const { token } = await api.post('/auth/login/discord', {
	code: sp.get('code'),
	redirect_uri: window.location.origin + '/redirect'
});

console.log(`token is ${token}`);
if (token) {
	localStorage.setItem('token', token);
}
window.location.replace('/');