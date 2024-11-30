import api from "../scripts/api.js";

const sp = new URLSearchParams(window.location.search);

const { token, userId } = await api.post('/auth/login/discord', {
	code: sp.get('code'),
	redirect_uri: window.location.origin + '/redirect'
});

console.log(`token is ${token}`);
if (token && userId) {
	localStorage.setItem('token', token);
	localStorage.setItem('userId', userId);
}
window.location.replace('/');