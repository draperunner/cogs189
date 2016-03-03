var menuState = {

    create: function() {
        // Name of the game
        var nameLabel = game.add.text(game.world.centerX, 100, 'Fatso', { font: '60px Arial', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);

        // How to play
        var lbl1 = game.add.text(game.world.centerX, game.world.centerY-60, "Eat all burgers to win", { font: '40px Arial', fill: '#ffffff' });
        lbl1.anchor.setTo(0.5, 0.5);
        var lbl2 = game.add.text(game.world.centerX, game.world.centerY+20, "Press r to restart", { font: '30px Arial', fill: '#ffffff' });
        lbl2.anchor.setTo(0.5, 0.5);
        var lbl3 = game.add.text(game.world.centerX, game.world.centerY+60, "Press up to jump", { font: '30px Arial', fill: '#ffffff' });
        lbl3.anchor.setTo(0.5, 0.5);
        var lbl4 = game.add.text(game.world.centerX, game.world.centerY+100, "Use attention to fly", { font: '30px Arial', fill: '#ffffff' });
        lbl4.anchor.setTo(0.5, 0.5);

        // How to start the game
        var startLabel = game.add.text(game.world.centerX, game.world.height-80, 'press the up arrow key to start', { font: '25px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(startLabel).to({angle: -2}, 500).to({angle:2}, 500).loop().start();

        // Start the game when the up arrow key is pressed
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.addOnce(this.start, this);
    },

    start: function() {
        game.state.start('play');
    }
};
