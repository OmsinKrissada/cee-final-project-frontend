const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  
  const speedDown = 300; 
  
  class GameScene extends Phaser.Scene {
    constructor() {
      super("scene-game");
      this.smallMeteor;
      this.largeMeteor;
      this.smallWordBox;
      this.largeWordBox;
      this.score = 0;
      this.scoreText;
      this.inputText = ""; 
    }
  
    preload() {
      this.load.image("met1", "../assets/meteor.png");
    }
  
    create() {  
      this.smallMeteor = this.physics.add.image(this.getRandomXForSmall(), 0, "met1")
        .setOrigin(0, 0)
        .setScale(0.1)
        .setMaxVelocity(0, speedDown);
      
      this.largeMeteor = this.physics.add.image(this.getRandomXForLarge(), 0, "met1")
        .setOrigin(0, 0)
        .setScale(0.2)
        .setMaxVelocity(0, speedDown - 100);
  
      this.smallWordBox = this.createFallingWordBox(this.getRandomXForSmall(), 0, 0.3);
      this.largeWordBox = this.createFallingWordBox(this.getRandomXForLarge(), 0, 0.4);
  
      this.scoreText = this.add.text(10, 10, 'Score: 0', {
        font: '20px Arial',
        fill: '#fff',
      });
  
      this.inputField = document.getElementById("userInput");
  
      this.inputField.addEventListener('input', (event) => {
        this.inputText = event.target.value;
      });
    }
  
    update() {
      if (this.smallMeteor.y > sizes.height) {
        this.smallMeteor.setY(0).setX(this.getRandomXForSmall()).setVelocityY(speedDown);
      }
      if (this.largeMeteor.y > sizes.height) {
        this.largeMeteor.setY(0).setX(this.getRandomXForLarge()).setVelocityY(speedDown - 100);
      }
  
      this.smallWordBox.y += speedDown * 0.005;  
      this.largeWordBox.y += speedDown * 0.005;  
  
      this.checkWordMatch(this.smallWordBox, 0.3);
      this.checkWordMatch(this.largeWordBox, 0.4);
  

      if (this.smallWordBox.y > sizes.height) {
        this.resetFallingWordBox(this.smallWordBox, this.getRandomXForSmall(), 0.3);
      }
      if (this.largeWordBox.y > sizes.height) {
        this.resetFallingWordBox(this.largeWordBox, this.getRandomXForLarge(), 0.4);
      }
    }
  
    createFallingWordBox(x, y, scale) {
      const wordBox = this.add.text(x, y, this.getRandomWord(), {
        font: `${Math.round(scale * 100)}px Arial`, 
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 200, useAdvancedWrap: true },
      }).setOrigin(0.5);
  
      return wordBox;
    }
  
    resetFallingWordBox(wordBox, x, scale) {
      wordBox.setY(0).setX(x);
      wordBox.setText(this.getRandomWord()); 
    }
  
    checkWordMatch(wordBox, scale) {
      if (this.inputText.trim().toLowerCase() === wordBox.text.toLowerCase()) {
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        this.resetFallingWordBox(wordBox, this.getRandomXForLarge(), scale);
        this.inputField.value = "";  
      }
    }
  
    getRandomWord() {
      const words = ['Sky', 'Energy', 'Meteor', 'Stars', 'Fall', 'Explosion', 'Space'];
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
  