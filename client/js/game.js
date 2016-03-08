// Initialize Phaser
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

// Our 'global' variable
game.global = {
    sound: true,
    score: 0,
    resets: 0,
    level: 1,
    numLevels: 11,
    debug: true,
    instructionsStyle: { font: '30px Arial', fill: '#ffffff' }
};

// Define states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

// Start the "boot" state
game.state.start('boot');

// helper codes
var debug = {
    on: function () {
        game.global.debug = true;
        game.state.start('play');
        console.log('Debug mode on');
    },
    off: function () {
        game.global.debug = false;
        game.state.start('play');
        console.log('Debug mode off');
    },
    level: function (n) {
        game.global.level = n;
        game.state.start('play');
        console.log('Level %i', n)
    }
}
