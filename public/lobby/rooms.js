import api from "../scripts/api.js";
import { BACKEND_URL } from "../scripts/config.js";

// room rendering

document.addEventListener('DOMContentLoaded', () => {
	fetchRooms();
	connectWithSSE();
});

function connectWithSSE() {
	const es = new EventSource(`${BACKEND_URL}/game/stream/lobby`);

	es.addEventListener("update", (msg) => {
		const body = JSON.parse(msg.data);
		console.log('got update');
		renderRooms(body);
	});

	es.onopen = () => {
		console.log("open");
	};
}

async function fetchRooms() {
	try {
		const rooms = await api.get('/game/list');
		console.log(`fetched ${rooms?.length} rooms`);
		console.log(rooms);
		renderRooms(rooms);
	} catch (error) {
		console.error('Error fetching rooms:', error);
	}
}

let actionButtons = [];
const roomsContainer = document.getElementById('rooms-container');

function disableButtons() {
	roomsContainer.firstElementChild.setAttribute('disabled', true);
	actionButtons.forEach(b => b.setAttribute('disabled', true));
}

function renderRooms(rooms) {
	roomsContainer.firstElementChild.removeAttribute('disabled');
	actionButtons = [];

	let isOwner = false;
	let occupiedRoom = null;

	const userId = localStorage.getItem('userId');

	for (let room of rooms) {
		if (room.owner == userId) isOwner = true;
		if (room.players.some(p => p.id == userId)) occupiedRoom = room.id;
	}

	while (roomsContainer.children.length > 1) roomsContainer.removeChild(roomsContainer.children[1]);

	if (occupiedRoom) {
		roomsContainer.firstElementChild.classList.add('hidden');
	} else {
		roomsContainer.firstElementChild.classList.remove('hidden');
	}

	rooms = rooms.sort((a, b) => {
		if (a.id == occupiedRoom) return -1;
		if (b.id == occupiedRoom) return 1;
		return a.id.localeCompare(b.id);
	});

	rooms.forEach(room => {
		const ownerName = room.players.filter(p => p.id == room.owner)[0]?.nickname || 'Somebody';

		const roomElement = document.createElement('div');
		roomElement.classList.add('room');

		const btnContainer = document.createElement('div');
		btnContainer.classList.add('flex', 'gap-2', 'p-4', 'mt-auto');

		if (occupiedRoom == room.id) {
			if (isOwner) {
				const btn = document.createElement('button');
				btn.classList.add('button', 'button-green', 'w-full');
				btn.textContent = 'Start Game';
				btn.addEventListener('click', () => {
					btn.textContent = 'Starting...';
					disableButtons();
					handleStartRoom(room.id);
				});
				actionButtons.push(btn);
				btnContainer.appendChild(btn);
			}

			const btn = document.createElement('button');
			btn.classList.add('button', 'button-red', 'w-full');
			btn.textContent = 'Leave Room';
			btn.addEventListener('click', () => {
				btn.textContent = 'Leaving...';
				disableButtons();
				handleLeaveRoom(room.id);
			});
			actionButtons.push(btn);
			btnContainer.appendChild(btn);
		}
		else if (!occupiedRoom) {
			const btn = document.createElement('button');
			btn.classList.add('button', 'button-primary', 'w-full');
			btn.textContent = 'Join Room';
			btn.addEventListener('click', () => {
				btn.textContent = 'Joining...';
				disableButtons();
				handleJoinRoom(room.id);
			});
			actionButtons.push(btn);
			btnContainer.appendChild(btn);
		}

		roomElement.innerHTML = `
        <div class="h-full rounded-lg box" style="background-color: rgb(56, 29, 11);">
          <div class="flex p-4">
            <h2 class="font-bold text-xl">${ownerName}'s Room</h2>
            <img src="/assets/icons/users.svg" alt="" class="mx-auto mr-2">
            <span class="flex items-center text-white">
              ${room.players.length}
            </span>
          </div>
          <div class="p-4 flex items-center justify-between text-sm">
            <ul>
              ${room.players.map(p => `<li>- ${p.nickname}</li>`).join('')}
            </ul>
          </div>
        </div>
        `;
		roomElement.firstElementChild.appendChild(btnContainer);
		roomsContainer.appendChild(roomElement);
	});
}

// room creation

document.getElementById('add-button').addEventListener('click', handleCreateRoom);

async function handleCreateRoom() {
	try {
		disableButtons();
		const updated = await api.post('/game');
		if (updated?.length) {
			renderRooms(updated);
		}
	} catch (err) {
		console.warn(err);
	}
}

// room joining

async function handleJoinRoom(roomId) {
	console.log(`Joining room ${roomId}`);
	const updated = await api.put('/game/join/' + roomId);
	if (updated?.length) {
		renderRooms(updated);
	}
}

async function handleLeaveRoom(roomId) {
	console.log(`Leaving room ${roomId}`);
	const updated = await api.put('/game/leave/' + roomId);
	if (updated?.length) {
		renderRooms(updated);
	}
}