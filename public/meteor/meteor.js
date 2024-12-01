const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const speedDown = 175; 
const words = ['game', 'start', 'sky', 'energy', 'meteor', 'stars', 'fall', 'explosion', 'space', 'implement'];

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.meteors = [];  
    this.score = 0;
    this.inputText = "";
  }

  preload() {
    this.load.image("met1", "../assets/AllMeteor/meteor7.png");  
  }

  create() {
    this.addMeteor();  
    this.addMeteor();

    this.inputField = document.getElementById("userInput");

    window.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.meteors.forEach(meteor => this.checkWordMatch(meteor));
        this.inputField.value = "";  
      }
    });

    setInterval(() => {
      this.addMeteor(); 
    }, 30000); 

    this.updateScoreDisplay();
  }

  update() {
    this.meteors.forEach(meteor => {
      this.updateMeteorAndWord(meteor, speedDown);
    });
  }

  addMeteor() {
    const word = this.getRandomWord();
    const xPosition = this.getRandomXForPosition();
    const yPosition = 0;

    const meteor = this.createMeteorAndWord(word, xPosition, yPosition);
    this.meteors.push(meteor);
  }

  createMeteorAndWord(word, xPosition, yPosition) {
    const scale = word.length * 0.1;

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
      this.resetMeteor(meteorData);
    }
  }

  resetMeteor(meteorData) {
    meteorData.meteor.y = 0;
    meteorData.meteor.x = this.getRandomXForPosition();
    meteorData.wordBox.setPosition(meteorData.meteor.x + meteorData.meteor.displayWidth / 2, meteorData.meteor.y + meteorData.meteor.displayHeight / 2);
    meteorData.word = this.getRandomWord();

    let temp_scale = meteorData.word.length * 0.1;
    
    meteorData.meteor.setScale(temp_scale);
    meteorData.wordBox.setText(meteorData.word); 
    meteorData.wordBox.setScale(temp_scale);
  }

  checkWordMatch(meteorData) {
    if (this.inputField.value === meteorData.word) {
      this.score++;
      this.updateScoreDisplay(); 
      this.resetMeteor(meteorData);
    }
  }

  updateScoreDisplay() {
    const scoreText = document.getElementById("scoreText");
    scoreText.innerText = `MyScore : ${this.score}`;
  }

  getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  getRandomXForPosition() {
    return Math.floor(Math.random() * (sizes.width - 300)); // Adjust to avoid edge collision
  }
}


const config = {
  type: Phaser.AUTO,
  width: sizes.width,
  height: sizes.height,
  scene: GameScene,
  parent: 'phaser-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);