const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const speedDown = 300; 

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.smallMeteor = null;
    this.largeMeteor = null;
    this.smallWordBox = null;
    this.largeWordBox = null;
    this.score = 0;
    this.scoreText = null;
    this.inputText = "";
  }

  preload() {
    this.load.image("met1", "../assets/meteor.png");
  }

  create() {
    // Create meteors
    // this.smallMeteor = this.physics.add.image(this.getRandomXForSmall(), 0, "met1")
    //   .setOrigin(0, 0)
    //   .setScale(0.1)
    //   .setMaxVelocity(0, speedDown);

    // this.largeMeteor = this.physics.add.image(this.getRandomXForLarge(), 0, "met1")
    //   .setOrigin(0, 0)
    //   .setScale(0.2)
    //   .setMaxVelocity(0, speedDown - 100);

    // this.smallWordBox = this.createFallingWordBox(this.getRandomXForSmall(), 0, 0.3);
    // this.largeWordBox = this.createFallingWordBox(this.getRandomXForLarge(), 0, 0.5);

    this.smallMeteor = this.createMeteorAndWord("small");
    this.largeMeteor = this.createMeteorAndWord("large");

    this.scoreText = this.add.text(10, 10, 'Score: 0', {
      font: '20px Arial',
      fill: '#fff',
    });

    this.inputField = document.getElementById("userInput");

    window.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.checkWordMatch(this.smallMeteor);
        this.checkWordMatch(this.largeMeteor);
        this.inputField.value = "";  
      }
    });
  }

  update() {
    // if (this.smallMeteor.y > sizes.height) {
    //   this.smallMeteor.setY(0).setX(this.getRandomXForSmall()).setVelocityY(speedDown);
    // }
    // if (this.largeMeteor.y > sizes.height) {
    //   this.largeMeteor.setY(0).setX(this.getRandomXForLarge()).setVelocityY(speedDown - 100);
    // }


    // this.smallWordBox.y += speedDown * 0.005;  
    // this.largeWordBox.y += speedDown * 0.005;  


    // if (this.smallWordBox.y > sizes.height) {
    //   this.resetFallingWordBox(this.smallWordBox, this.getRandomXForSmall(), 0.3);
    // }
    // if (this.largeWordBox.y > sizes.height) {
    //   this.resetFallingWordBox(this.largeWordBox, this.getRandomXForLarge(), 0.5);
    // }
    this.updateMeteorAndWord(this.smallMeteor, speedDown);
    this.updateMeteorAndWord(this.largeMeteor, speedDown - 100);
  }

  createMeteorAndWord(size) {
    const scale = size === "small" ? 0.1 : 0.2;
    const xPosition = size === "small" ? this.getRandomXForSmall() : this.getRandomXForLarge();

    const meteor = this.physics.add.image(xPosition, 0, "met1")
      .setOrigin(0, 0)
      .setScale(scale)
      .setMaxVelocity(0, speedDown);

    const wordBox = this.add.text(xPosition + meteor.displayWidth / 2, meteor.displayHeight / 2, this.getRandomWord(), {
      backgroundColor: "#ffffff",
      font: `${Math.round(scale * 300)}px Arial`, 
      fill: "#000000",
      align: "center",
      padding: { left: 5, right: 5, top: 5, bottom: 5 },
      wordWrap: { width: 200, useAdvancedWrap: true },
    }).setOrigin(0.5);

    return { meteor, wordBox }; //for context kub : this used as pair in parameter for other function :)
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
    const xPosition = pair.meteor.scaleX === 0.1 ? this.getRandomXForSmall() : this.getRandomXForLarge();
    pair.meteor.setY(0).setX(xPosition);
    pair.wordBox.setText(this.getRandomWord());
  }

  // createFallingWordBox(x, y, scale) {
  //   const wordBox = this.add.text(x, y, this.getRandomWord(), {
  //     font: `${Math.round(scale * 100)}px Arial`, 
  //     fill: "#ffffff",
  //     align: "center",
  //     wordWrap: { width: 200, useAdvancedWrap: true },
  //   }).setOrigin(0.5);

  //   return wordBox;
  // }

  // resetFallingWordBox(wordBox, x, scale) {
  //   wordBox.setY(0).setX(x);
  //   wordBox.setText(this.getRandomWord()); 
  // }

  checkWordMatch(pair) {
    this.inputText = this.inputField.value.trim().toLowerCase();

    if (this.inputText === pair.wordBox.text.toLowerCase()) {
      this.score += 10;
      this.scoreText.setText('Score: ' + this.score);
      this.resetMeteorAndWord(pair);
    }
  }

  getRandomWord() {
    const words = ['sky', 'energy', 'meteor', 'stars', 'fall', 'explosion', 'space'];
    return words[Phaser.Math.Between(0, words.length - 1)];
  }

  getRandomXForSmall() {
    return Phaser.Math.Between(100, sizes.width - 100);
  }

  getRandomXForLarge() {
    return Phaser.Math.Between(300, sizes.width - 300);
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