import { BACKEND_URL } from "./config.js";

// let nickname = null;
let isEditable = false;

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

	await fetch(`${BACKEND_URL}/player/nickname`, {
		method: 'POST',
		body: JSON.stringify({ newNickname })
	});

	isEditable = false;
}

function makeEditable() {
	inputField.removeAttribute('disabled');
	submitIcon.setAttribute('src', 'assets/icons/check.svg');

	isEditable = true;
}

export async function getNickname() {
	const { nickname } = await fetch(`${BACKEND_URL}/player/nickname`).then(r => r.json());
	inputField.value = nickname;
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
