import { getNickname } from './nickname.js';

getNickname();

// set OAuth URL
const discordLoginButton = document.getElementById('discord-login-button');
const oauthUrl = `https://discord.com/oauth2/authorize?client_id=808361107118096454&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin + '/redirect')}&scope=identify`;
discordLoginButton.setAttribute('href', oauthUrl);

if (localStorage.getItem('token')) {
	document.getElementById('when-logged-in').style.display = null;
} else {
	document.getElementById('when-logged-out').style.display = null;
}