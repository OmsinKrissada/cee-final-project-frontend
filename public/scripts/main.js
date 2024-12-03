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


async function fetchOverallLeaderboard() {
	const container = document.getElementById('lb-overall-container');
	const outerContainer = document.getElementById('lb-overall-outer-container');
	const lb = await api.get(`/leaderboard/overall`);
	if (lb) {
		let i = 1;
		for (const p of lb) {
			const tr = document.createElement('tr');
			tr.classList.add('table-row');
			tr.innerHTML = `
			    <td class="table-cell">${i++}</td>
			    <td class="table-cell">${p.nickname}</td>
			    <td class="table-cell leaderboard-score">${p.score}</td>
			`;
			container.appendChild(tr);
		}
		outerContainer.style.display = 'block';

		// setTimeout cuz the transition effect doesn't happen when all these 3 styles are applied at the same time
		outerContainer.style.opacity = 1;
		outerContainer.style.filter = 'blur(0)';
	}
}

async function fetchHighestLeaderboard() {
	const container = document.getElementById('lb-highest-container');
	const outerContainer = document.getElementById('lb-highest-outer-container');
	const lb = await api.get(`/leaderboard/highest`);
	if (lb) {
		let i = 1;
		for (const p of lb) {
			const tr = document.createElement('tr');
			tr.classList.add('table-row');
			tr.innerHTML = `
			    <td class="table-cell">${i++}</td>
			    <td class="table-cell">${p.nickname}</td>
			    <td class="table-cell leaderboard-score">${p.score}</td>
			`;
			container.appendChild(tr);
		}
		outerContainer.style.display = 'block';

		// setTimeout cuz the transition effect doesn't happen when all these 3 styles are applied at the same time
		outerContainer.style.opacity = 1;
		outerContainer.style.filter = 'blur(0)';
	}
}

fetchOverallLeaderboard();
fetchHighestLeaderboard();