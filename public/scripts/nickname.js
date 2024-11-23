import api from "./api.js";

// let nickname = null;
let isEditable = false;

const box = document.getElementById('nickname-box');
const inputField = document.getElementById('nickname-input');
const submitButton = document.getElementById('nickname-submit');
const submitIcon = document.querySelector('#nickname-submit>img');

export async function changeNickname() {
	// nickname = newNickname;
	const newNickname = inputField.value;
	if (!newNickname) return;
	console.log(`changing nickname to ${newNickname} ${newNickname.length}`);

	inputField.setAttribute('disabled', true);
	submitIcon.setAttribute('src', 'assets/icons/edit.svg');
	inputField.style.borderBottom = null;

	isEditable = false;

	await api.post(`/player/nickname`, {
		nickname: newNickname
	});
}

function makeEditable() {
	inputField.removeAttribute('disabled');
	submitIcon.setAttribute('src', 'assets/icons/check.svg');
	inputField.style.borderBottom = '2px solid hsl(21, 86%, 25%)';

	isEditable = true;
}

export async function getNickname() {
	const { nickname } = await api.get(`/player/nickname`);
	if (nickname) {
		inputField.value = nickname;
		box.style.display = 'flex';

		// setTimeout cuz the transition effect doesn't happen when all these 3 styles are applied at the same time
		setTimeout(() => {
			box.style.opacity = 1;
			box.style.filter = 'blur(0)';
		}, 0);
	}
}


submitButton.addEventListener('click', () => {
	if (isEditable) {
		changeNickname();
	} else {
		makeEditable();
	}
});

inputField.addEventListener('keypress', e => {
	if (e.code == 'Enter')
		changeNickname();
});
