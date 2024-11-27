const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const speedDown = 250;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.firstMeteor = null;
    this.secondMeteor = null;
    // this.smallWordBox = null;
    // this.largeWordBox = null;
    this.score = 0;
    this.scoreText = null;
    this.inputText = "";
  }

  preload() {
    this.load.image("met1", "../assets/meteor.png");
  }

  create() {
    this.firstMeteor = this.createMeteorAndWord("game", this.getRandomXForSmall(), 0); // fix word "game" แก้ทีหลังได้
    this.secondMeteor = this.createMeteorAndWord("start", this.getRandomXForLarge(), 0); // fix word "start" แก้ทีหลังได้

    this.scoreText = this.add.text(10, 10, 'Score: 0', {
      font: '20px Arial',
      fill: '#fff',
    });

    this.inputField = document.getElementById("userInput");

    window.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.checkWordMatch(this.firstMeteor);
        this.checkWordMatch(this.secondMeteor);
        this.inputField.value = "";  
      }
    });
  }

  update() {
    this.updateMeteorAndWord(this.firstMeteor, speedDown);
    this.updateMeteorAndWord(this.secondMeteor, speedDown - 100);
  }

  createMeteorAndWord(word, xPosition, yPosition) {
    const scale  = word.length <= 4 ? 0.1 : 0.2;

    const meteor = this.physics.add.image(xPosition, 0, "met1")
      .setOrigin(0, 0)
      .setScale(scale)
      .setMaxVelocity(0, speedDown);

    const wordBox = this.add.text(xPosition + meteor.displayWidth / 2, yPosition + meteor.displayHeight / 2, word, {
      backgroundColor: "#ffffff",
      font: `${Math.round(scale * 300)}px Arial`, 
      fill: "#000000",
      align: "center",
      padding: { left: 5, right: 5, top: 5, bottom: 5 },
      wordWrap: { width: 200, useAdvancedWrap: true },
    }).setOrigin(0.5);

    return { meteor, wordBox };
  }

  updateMeteorAndWord(pair, velocityY) {
    pair.meteor.setVelocityY(velocityY);
    pair.wordBox.y = pair.meteor.y + pair.meteor.displayHeight / 2;
    pair.wordBox.x = pair.meteor.x + pair.meteor.displayWidth / 2;

    if (pair.meteor.y > sizes.height) {
      this.resetMeteorAndWord(pair);
    }
  }

  resetMeteorAndWord(pair) {
    const newWord = this.getRandomWord(); 
    const xPosition = newWord.length <= 4 ? this.getRandomXForSmall() : this.getRandomXForLarge();  

    pair.meteor.setY(0).setX(xPosition).setScale(newWord.length <= 4 ? 0.1 : 0.2);
    pair.wordBox.setText(newWord).setFont(`${Math.round(newWord.length <= 4 ? 0.1 * 300 : 0.2 * 300)}px Arial`);
  }

  getRandomWord() {
    const words = ['game', 'start', 'sky', 'energy', 'meteor', 'stars', 'fall', 'explosion', 'space'];
    return words[Phaser.Math.Between(0, words.length - 1)];
  }

  getRandomXForSmall() {
    return Phaser.Math.Between(100, sizes.width - 100);
  }

  getRandomXForLarge() {
    return Phaser.Math.Between(300, sizes.width - 300);
  }

  checkWordMatch(pair) {
    if (this.inputField.value.toLowerCase() === pair.wordBox.text.toLowerCase()) {
      this.score += 10;
      this.scoreText.setText('Score: ' + this.score);
      this.resetMeteorAndWord(pair); 
    }
  }
}


const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: document.getElementById("gameCanvas"),
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: false,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);