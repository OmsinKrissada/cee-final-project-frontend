import api from "../scripts/api.js";

// room rendering

document.addEventListener('DOMContentLoaded', () => {
	fetchRooms();
});

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

function renderRooms(rooms) {
	const roomsContainer = document.getElementById('rooms-container');
	while (roomsContainer.children.length > 1) roomsContainer.removeChild(roomsContainer.children[1]);

	rooms.forEach(room => {
		const ownerName = room.players.filter(p => p.id == room.owner)[0]?.nickname || 'Somebody';

		const roomElement = document.createElement('div');
		roomElement.classList.add('room');

		const btnContainer = document.createElement('div');
		btnContainer.classList.add('p-4');
		const btn = document.createElement('button');
		btn.classList.add('button', 'button-primary', 'w-full');
		btn.textContent = 'Join Room';
		btnContainer.appendChild(btn);

		roomElement.innerHTML = `
        <div class="rounded-lg box" style="background-color: rgb(56, 29, 11);">
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

		btn.addEventListener('click', () => {
			console.log(`joining ${room._id}`);
			handleJoinRoom(room._id);
		});
	});
}

// room creation

document.getElementById('add-button').addEventListener('click', handleCreateRoom);

async function handleCreateRoom() {
	try {
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

// function renderRooms(rooms) {
// 	const roomsContainer = document.getElementById('rooms-container');
// 	roomsContainer.innerHTML = '';

// 	rooms.forEach(room => {
// 		const roomElement = document.createElement('div');
// 		roomElement.classList.add('room');
// 		roomElement.innerHTML = `
//             <h2>${room.name}</h2>
//             <p>Players waiting: ${room.players}/${room.capacity}</p>
//         `;
// 		roomElement.addEventListener('click', () => {
// 			handleJoinRoom(room.id);
// 		});
// 		roomsContainer.appendChild(roomElement);
// 	});
// }

// document.addEventListener('DOMContentLoaded', () => {
// 	renderRooms(rooms);
// });
