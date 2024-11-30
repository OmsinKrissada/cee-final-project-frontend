document.addEventListener("DOMContentLoaded", () => {
    const leaderboard = document.getElementById("leaderboard");
    setTimeout(() => {
      leaderboard.style.opacity = "1";
      leaderboard.style.transform = "translateY(0)";
    }, 2500); // Delay matches the CSS animation delay
  });