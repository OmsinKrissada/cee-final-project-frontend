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

const textField = document.getElementById("userInput");

function sendText() {
    textField.value = "";
}

function create() {
    const button = document.getElementById("clearButton");
    textField.addEventListener('keypress', e => {
        if (e.code == 'Enter') sendText();
    });
    button.addEventListener("click", () => sendText());
}

function update() {

}

window.addEventListener("resize", () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
