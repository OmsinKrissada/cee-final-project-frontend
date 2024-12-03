import { BACKEND_URL } from "../scripts/config.js";
import api from "../scripts/api.js";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const speedDown = 175;
// const words = ['game', 'start', 'sky', 'energy', 'meteor', 'stars', 'fall', 'explosion', 'space', 'implement'];

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.meteors = [];
    this.score = 0;
    this.inputText = "";
    this.timeLeft = 120;
  }

  forwardResult(result) {
    window.location.href = '/result?d=' + btoa(JSON.stringify(result));
  }

  // telemetry

  async connectWithSSE() {
    const res = await api.get(`/game/playtoken`);
    if (!res || !res.token) {
      window.location.href = '/';
      return;
    }

    const es = new EventSource(`${BACKEND_URL}/game/stream/play/${res.token}`);

    es.addEventListener("word", (msg) => {
      const { word } = JSON.parse(msg.data);
      console.debug(`got word: ${word}`);
      this.addMeteor(word);
    });

    es.addEventListener("conclude", (msg) => {
      const body = JSON.parse(msg.data);
      console.debug('got conclude');
      console.debug(body);
      this.forwardResult(body);
    });

    es.addEventListener("score", (msg) => {
      const body = JSON.parse(msg.data);
      console.debug('got score');
      console.debug(body);
      this.updateScoreDisplay(body);
    });

    es.addEventListener("time_remaining", (msg) => {
      const body = JSON.parse(msg.data);
      console.debug('got time');
      console.debug(body);
      this.timeLeft = body.seconds + 1;
    });

    es.onopen = () => {
      console.log("open");
    };

    es.onerror = (e) => {
      console.log('error', e.status);
      console.log(e);
      es.close();
      // this.connectWithSSE();
      console.error('Connection with server interrupted, try refreshing...');
    };

  }


  preload() {
    this.load.image("met1", "../assets/AllMeteor/meteor7.png");
  }

  create() {
    this.connectWithSSE();
    // this.addMeteor();
    // this.addMeteor();
    // this.startTimer();

    setTimeout(() => {
      this.forwardResult("name", "score");
    }, 120000);

    this.inputField = document.getElementById("userInput");
    this.clearButton = document.getElementById("clearButton");

    window.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.meteors.forEach(meteor => this.checkWordMatch(meteor));
        this.inputField.value = "";
      }
    });

    this.clearButton.addEventListener("click", () => {
      this.meteors.forEach(meteor => this.checkWordMatch(meteor));
      this.inputField.value = "";  // Clear the input field after submitting
    });

    setInterval(() => {
      if (this.timeLeft > 0) this.timeLeft--;
      this.updateTimerDisplay();
    }, 1000);

    // setInterval(() => {
    //   this.addMeteor();
    // }, 30000);

    // this.updateScoreDisplay();

    this.deleteMeteor(this.createMeteorAndWord('', -100, -100));
  }

  update() {
    this.meteors.forEach(meteor => {
      this.updateMeteorAndWord(meteor, speedDown);
    });
  }

  updateTimerDisplay() {
    let minutes = Math.floor(this.timeLeft / 60);
    let seconds = this.timeLeft % 60;
    if (seconds < 10) seconds = "0" + seconds;
    if (minutes < 10) minutes = "0" + minutes;
    document.getElementById("time-left").innerText = `${minutes}:${seconds}`;
  }

  formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  addMeteor(word) {
    const xPosition = this.getRandomXForPosition();
    const yPosition = 0;

    const meteor = this.createMeteorAndWord(word, xPosition, yPosition);
    this.meteors.push(meteor);
  }

  createMeteorAndWord(word, xPosition, yPosition) {
    const scale = word.length * 0.125;

    const meteor = this.physics.add.image(xPosition, yPosition, "met1")
      .setOrigin(0, 0)
      .setScale(scale)
      .setMaxVelocity(0, speedDown);

    const wordBox = this.add.text(xPosition + meteor.displayWidth / 2, yPosition + meteor.displayHeight / 2, word, {
      font: `${50}px 'MyFont'`,
      fill: "#ffffff",
    }).setOrigin(0.5).setScale(scale);

    return { meteor, wordBox, word };
  }

  updateMeteorAndWord(meteorData, speed) {
    meteorData.meteor.y += speed * this.game.loop.delta / 1000;

    meteorData.wordBox.setPosition(meteorData.meteor.x + meteorData.meteor.displayWidth / 2, meteorData.meteor.y + meteorData.meteor.displayHeight / 2);

    if (meteorData.meteor.y > sizes.height) {
      this.deleteMeteor(meteorData);
    }
  }

  // resetMeteor(meteorData) {
  //   meteorData.meteor.y = 0;
  //   meteorData.meteor.x = this.getRandomXForPosition();
  //   meteorData.wordBox.setPosition(meteorData.meteor.x + meteorData.meteor.displayWidth / 2, meteorData.meteor.y + meteorData.meteor.displayHeight / 2);
  // meteorData.word = this.getRandomWord();

  //   let temp_scale = meteorData.word.length * 0.1;

  //   meteorData.meteor.setScale(temp_scale);
  //   meteorData.wordBox.setText(meteorData.word);
  //   meteorData.wordBox.setScale(temp_scale);
  // }

  deleteMeteor(meteorData) {
    meteorData.meteor.destroy();
    meteorData.wordBox.destroy();
  }

  checkWordMatch(meteorData) {
    if (this.inputField.value === meteorData.word) {
      // this.score++;
      this.handleCorrectWord(this.inputField.value);
      // this.updateScoreDisplay();
      this.deleteMeteor(meteorData);
    }
  }

  handleCorrectWord(word) {
    api.post('/game/type/' + word);
  }

  updateScoreDisplay(scores) {
    const container = document.getElementById("scoreboard-list");
    container.innerHTML = '';

    for (const score of scores) {
      const li = document.createElement('li');
      li.textContent = `${score.nickname}: ${score.score}`;
      container.appendChild(li);
    }
  }

  // getRandomWord() {
  //   return words[Math.floor(Math.random() * words.length)];
  // }

  getRandomXForPosition() {
    return Math.floor(Math.random() * (sizes.width - 300));
  }
}


const config = {
  type: Phaser.AUTO,
  width: sizes.width,
  height: sizes.height,
  scene: GameScene,
  parent: 'phaser-container',
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

document.getElementById('exit-button').addEventListener('click', async () => {
  await api.put('/game/leave/' + new URLSearchParams(window.location.search).get('id'));
  window.location.href = '/lobby';
});

const game = new Phaser.Game(config);