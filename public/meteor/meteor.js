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
  }

  preload() {
    this.load.image("met1", "../assets/meteor.png");
  }

  create() {
    this.smallMeteor = this.physics.add.image(this.getRandomXForSmall(), 0, "met1").setOrigin(0, 0).setScale(0.1).setMaxVelocity(0, speedDown);
    this.largeMeteor = this.physics.add.image(this.getRandomXForLarge(), 0, "met1").setOrigin(0, 0).setScale(0.2).setMaxVelocity(0, speedDown - 100);
  }

  update() {
    if (this.smallMeteor.y > sizes.height) {
      this.smallMeteor.setY(0).setX(this.getRandomXForSmall()).setVelocityY(speedDown);
    }
    if (this.largeMeteor.y > sizes.height) {
      this.largeMeteor.setY(0).setX(this.getRandomXForLarge()).setVelocityY(speedDown - 100);
    }
  }

  getRandomXForSmall() {
    return Phaser.Math.Between(100, sizes.width-100);
  }

  getRandomXForLarge() {
    return Phaser.Math.Between(300, sizes.width-300);
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
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);


const textField = document.getElementById("userInput");

function sendText() {
  textField.value = "";
}

const button = document.getElementById("clearButton");

textField.addEventListener('keypress', e => {
  if (e.code === 'Enter') {
    sendText(); 
  }
});

button.addEventListener("click", () => {
  sendText(); 
});

window.addEventListener("resize", () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});