import api from './api.js';
import { getNickname } from './nickname.js';

getNickname();

// set OAuth URL
const discordLoginButton = document.getElementById('discord-login-button');
const oauthUrl = `https://discord.com/oauth2/authorize?client_id=808361107118096454&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin + '/redirect')}&scope=identify`;
discordLoginButton.setAttribute('href', oauthUrl);

const guestLoginButton = document.getElementById('guest-login-button');
guestLoginButton.addEventListener('click', async () => {
	const { token, userId } = await api.post('/auth/login/guest');
	if (token && userId) {
		localStorage.setItem('token', token);
		localStorage.setItem('userId', userId);
	}
	window.location.reload();
});

document.getElementById('logout-button').addEventListener('click', () => {
	localStorage.removeItem('token');
	window.location.reload();
});

if (localStorage.getItem('token')) {
	document.getElementById('when-logged-in').style.display = null;
} else {
	document.getElementById('when-logged-out').style.display = null;
}