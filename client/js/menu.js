var menuState = {

    create: function() {
        // Name of the game
        var nameLabel = game.add.text(game.world.centerX, 80, 'Fatso', { font: '50px Arial', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);

        // Disclaimer
        var disclaimer = game.add.text(game.world.centerX, 150, 'PS! This game is a work in progress', { font: '30px Arial', fill: '#ffffff' });
        disclaimer.anchor.setTo(0.5, 0.5);

        // How to play
        var lbl1 = game.add.text(game.world.centerX, game.world.centerY, "Eat all burges to win", { font: '30px Arial', fill: '#ffffff' });
        lbl1.anchor.setTo(0.5, 0.5);
        var lbl2 = game.add.text(game.world.centerX, game.world.centerY+40, "Press r to restart", { font: '30px Arial', fill: '#ffffff' });
        lbl2.anchor.setTo(0.5, 0.5);

        // How to start the game
        var startLabel = game.add.text(game.world.centerX, game.world.height-80, 'press the up arrow key to start', { font: '25px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(startLabel).to({angle: -2}, 500).to({angle:2}, 500).loop().start();

        // Add a mute button
        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        this.muteButton.input.useHandCursor = true;
        if (!game.global.sound) {
            this.muteButton.frame = 1;
        }

        // Start the game when the up arrow key is pressed
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.addOnce(this.start, this);
    },

    toggleSound: function() {
        game.global.sound = ! game.global.sound;
        this.muteButton.frame = game.global.sound ? 0 : 1;
    },

    start: function() {
        game.state.start('play');
    }
};
