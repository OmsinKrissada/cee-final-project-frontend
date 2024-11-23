import "./style.css";
//import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.meteor;
  }

  preload() {
    this.load.image("bg", "../assets/ENG4.png");
    this.load.image("met1", "../assets/meteor.png");
  }

  create() {
    this.add.image(0, 0, "bg");
    this.meteor = this.physics.add.image(sizes.width / 2, 0, "met1").setOrigin(0.5, 0.5).setVelocityY(speedDown);
    this.meteor.setBounce(1);  
    this.meteor.setCollideWorldBounds(true);
  }

  update() {
    if (this.meteor.y > sizes.height) {
      this.meteor.setY(0);
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
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);