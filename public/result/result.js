const leaderboard = document.getElementById("leaderboard-container");

document.addEventListener("DOMContentLoaded", () => {
  try {
    const encoded = new URLSearchParams(window.location.search).get('d');
    console.log(encoded);
    console.log(atob(encoded));
    const parsed = JSON.parse(atob(encoded));
    render(parsed);
  } catch (e) {
    console.error(e);
    window.location.href = '/';
  }
  leaderboard.style.display = 'block';
});

function render(data) {
  const parent = document.getElementById('player-list');

  const userId = localStorage.getItem('userId');
  // if(!userId)
  document.getElementById('my-score').textContent = data.filter(p => p.id == userId)[0].score;

  for (let i = 0; i < data.length; i++) {
    const row = document.createElement('tr');
    row.classList.add('table-row');

    let nickname = data[i].nickname;
    if (nickname.length > 20) nickname = nickname.substring(0, 20) + '...';

    row.innerHTML = `
    <td class="table-cell">${i + 1}</td>
    <td class="table-cell leaderboard-name">${nickname}</td>
    <td class="table-cell leaderboard-score">${data[i].score}</td>
  `;

    parent.appendChild(row);
  }

  setTimeout(() => {
    leaderboard.style.opacity = "1";
    leaderboard.style.transform = "translateY(0)";
  }, 2500); // Delay matches the CSS animation delay
}