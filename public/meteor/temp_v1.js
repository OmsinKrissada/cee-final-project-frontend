const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  
  const speedDown = 175;  // Slower meteor speed
  const words = ['game', 'start', 'sky', 'energy', 'meteor', 'stars', 'fall', 'explosion', 'space', 'implement'];
  
  class GameScene extends Phaser.Scene {
    constructor() {
      super("scene-game");
      this.meteors = [];  // Store all meteors in an array
      this.score = 0;
      this.inputText = "";
    }
  
    preload() {
      this.load.image("met1", "../assets/AllMeteor/meteor7.png");  // Load meteor image
    }
  
    create() {
      // Create the initial meteors with random words
      this.addMeteor();  // Create first meteor
      this.addMeteor();  // Create second meteor
  
      // Reference the input field for checking user input
      this.inputField = document.getElementById("userInput");
  
      // Event listener for when the user presses Enter to check the words
      window.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          this.meteors.forEach(meteor => this.checkWordMatch(meteor));
          this.inputField.value = "";  // Clear input field after checking
        }
      });
  
      // Add new meteor every 30 seconds
      setInterval(() => {
        this.addMeteor(); // Add a new meteor
      }, 30000); // 30 seconds (30000 milliseconds)
  
      // Update the score display in HTML
      this.updateScoreDisplay();
    }
  
    update() {
      // Update the positions of the meteors and words
      this.meteors.forEach(meteor => {
        this.updateMeteorAndWord(meteor, speedDown);
      });
    }
  
    addMeteor() {
      // Generate a random word
      const word = this.getRandomWord();
      const xPosition = this.getRandomXForPosition();
      const yPosition = 0; // Start at the top of the screen
  
      // Create the meteor and word
      const meteor = this.createMeteorAndWord(word, xPosition, yPosition);
      this.meteors.push(meteor); // Add the meteor to the array
    }
  
    createMeteorAndWord(word, xPosition, yPosition) {
      // Create meteor object
      const scale = word.length <= 7 ? 0.5 : 0.7;
  
      const meteor = this.physics.add.image(xPosition, yPosition, "met1")
        .setOrigin(0, 0)
        .setScale(scale)
        .setMaxVelocity(0, speedDown);
  
      // Create word box
      const wordBox = this.add.text(xPosition + meteor.displayWidth / 2, yPosition + meteor.displayHeight / 2, word, {
        font: `${scale * 50}px 'MyFont'`,
        fill: "#ffffff",
        fontWeight: "bold",
      }).setOrigin(0.5);
  
      // Return both the meteor and the word box
      return { meteor, wordBox, word };
    }
  
    updateMeteorAndWord(meteorData, speed) {
      // Update meteor's position
      meteorData.meteor.y += speed * this.game.loop.delta / 1000; // Adjust speed with game time
  
      // Update the word box position to follow the meteor
      meteorData.wordBox.setPosition(meteorData.meteor.x + meteorData.meteor.displayWidth / 2, meteorData.meteor.y + meteorData.meteor.displayHeight / 2);
  
      // If meteor goes off the screen, reset it
      if (meteorData.meteor.y > sizes.height) {
        this.resetMeteorAndWord(meteorData);
      }
    }
  
    resetMeteorAndWord(meteorData) {
      // Reset the meteor to the top of the screen with a new word
      meteorData.meteor.y = 0;
      meteorData.meteor.x = this.getRandomXForPosition();
      meteorData.wordBox.setPosition(meteorData.meteor.x + meteorData.meteor.displayWidth / 2, meteorData.meteor.y + meteorData.meteor.displayHeight / 2);
      meteorData.word = this.getRandomWord();  // Get a new word for the meteor
      meteorData.wordBox.setText(meteorData.word);  // Update the word displayed
    }
  
    checkWordMatch(meteorData) {
      // Check if the input field value matches the word in the meteor
      if (this.inputField.value === meteorData.word) {
        this.score++;
        this.updateScoreDisplay(); // Update the score display
        this.resetMeteorAndWord(meteorData); // Reset the meteor when the word matches
      }
    }
  
    updateScoreDisplay() {
      const scoreText = document.getElementById("scoreText");
      scoreText.innerText = `MyScore : ${this.score}`;
    }
  
    getRandomWord() {
      // Get a random word from the list
      return words[Math.floor(Math.random() * words.length)];
    }
  
    getRandomXForPosition() {
      // Get a random x position within screen width
      return Math.floor(Math.random() * (sizes.width - 100)); // Adjust to avoid edge collision
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
  