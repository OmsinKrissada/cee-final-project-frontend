const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, 
    height: window.innerHeight, 
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    scale: {
        mode: Phaser.Scale.RESIZE, 
        autoCenter: Phaser.Scale.CENTER_BOTH, 
    },
    parent: 'phaser-container', 
    transparent: true, 
};

const game = new Phaser.Game(config);

function preload() {
    
}

function create() {
    const button = document.getElementById("clearButton");
    button.addEventListener("click", () => {
        const textField = document.getElementById("userInput");
        textField.value = "";
    });
}

function update() {
    
}

window.addEventListener("resize", () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
