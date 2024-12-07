// Initialize and start the game
let game;

function init() {
    game = new Game();
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    game.update();
}

// Start the game when the window loads
window.addEventListener('load', init);