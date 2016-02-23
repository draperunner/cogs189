// Initialize Phaser
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

// Our 'global' variable
game.global = {
    sound: true,
    score: 0,
    resets: 0,
    level: 1,
    numLevels: 4
};

// Define states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

// Start the "boot" state
game.state.start('boot');
