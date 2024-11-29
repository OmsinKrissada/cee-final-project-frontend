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
              ${room.players.map(p => `<li>- ${p.nickname}</li>`)}
            </ul>
          </div>
          <div class="p-4">
            <button class="button button-primary w-full">Join Room</button>
          </div>
        </div>
        `;
		roomElement.addEventListener('click', () => {
			selectRoom(room.id);
		});
		roomsContainer.appendChild(roomElement);
	});
}

function selectRoom(roomId) {
	window.location.href = `/game?roomId=${roomId}`;
}

// room creation

document.getElementById('add-button').addEventListener('click', handleCreateRoom);

async function handleCreateRoom(e) {
	// e.preventDefault();
	// const newRoom = {
	// 	id: (rooms.length + 1).toString(),
	// 	name: newRoomName,
	// 	gameType: newRoomType,
	// 	players: 0,
	// 	capacity: 4,
	// };
	// rooms.push(newRoom);
	// newRoomName = '';
	// newRoomType = '';
	// showCreateModal = false;
	// renderRooms(rooms);
	try {
		const updatedRooms = await api.post('/game');
		if (updatedRooms.length) {
			renderRooms(updatedRooms);
		}
	} catch (err) {
		console.warn(err);
	}
}

function handleJoinRoom(roomId) {
	console.log(`Joining room ${roomId}`);
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
