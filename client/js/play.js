var playState = {

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Keyboard
        this.cursor = game.input.keyboard.createCursorKeys();
        this.r = game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.d = game.input.keyboard.addKey(Phaser.Keyboard.D);

        // Toggle debug mode when d key is pressed
        this.d.onDown.add(function () {
            this.debugAttention.visible = !this.debugAttention.visible;
            this.debugMeditation.visible = !this.debugMeditation.visible;
            this.debugBlink.visible = !this.debugBlink.visible;
            this.debugPoorSignalLevel.visible = !this.debugPoorSignalLevel.visible;
        }, this);


        // Level
        this.createWorld();

        // Wabbit
        var result = this.findObjectsByGID(21, this.map, 'Object Layer 1');
        this.wabbit = game.add.sprite(result[0].x, result[0].y, 'wabbit');

        this.wabbit.anchor.setTo(0.5, 1);
        game.physics.arcade.enable(this.wabbit);

        this.wabbit.body.gravity.y = (!game.global.debug) ? 500 : 0;
        this.wabbit.body.collideWorldBounds = true;

        this.horizontalSpeed = 300;
        this.jumpSpeed = 100;

        // Settings for neurosky
        this.flyThreshold = 30;

        // Create burgers
        this.burgers = game.add.group();
        this.burgers.enableBody = true;
        this.map.createFromObjects('Object Layer 1', 22, 'burger', 0, true, false, this.burgers);
        this.numberOfBurgers = this.burgers.length;

        // Create lava (deadly tiles)
        this.map.setTileIndexCallback(24, this.reset, this);
        this.map.setTileIndexCallback(26, this.reset, this);

        // Movable objects (elevator, stone, etc.)
        this.movables = game.add.group();
        this.movables.enableBody = true;
        var img = rules.get(game.global.level, 'movableObject');
        this.map.createFromObjects('Object Layer 1', 23, img, 0, true, false, this.movables);
        this.movables.forEach(function(movable) {
            if (img === 'stone') {
                movable.anchor.x = 0.5;
            }
            movable.body.immovable = true;
            movable.body.allowGravity = false;
            movable.body.collideWorldBounds = true;
        }, this);

        // Neurosky debug texts
        this.debugAttention = game.add.text(10, 10, 'A: ' + neurosky.attention, { font: '18px Arial', fill: '#ffffff' });
        this.debugMeditation = game.add.text(10, 30, 'M: ' + neurosky.meditation, { font: '18px Arial', fill: '#ffffff' });
        this.debugBlink = game.add.text(10, 50, 'B: ' + neurosky.blink, { font: '18px Arial', fill: '#ffffff' });
        this.debugPoorSignalLevel = game.add.text(10, 70, 'S: ' + neurosky.poorSignalLevel, { font: '18px Arial', fill: '#ffffff' });
    },

    update: function() {
        game.physics.arcade.collide(this.wabbit, this.layer);
        game.physics.arcade.collide(this.wabbit, this.movables);
        game.physics.arcade.collide(this.layer, this.movables);
        game.physics.arcade.overlap(this.wabbit, this.burgers, this.eatBurger, null, this);
        game.physics.arcade.overlap(this.wabbit, this.movables, rules.get(game.global.level, 'overlapMovable').bind(this)(), null, this);

        if (this.r.isDown) {
            this.reset();
        }
        this.updateDebugTexts();
        if (game.global.debug) {
            rules.methods.godModeMove.bind(this)();
            return;
        }
        rules.get(game.global.level, 'move').bind(this)();
        rules.get(game.global.level, 'jump').bind(this)();
        rules.get(game.global.level, 'moveMovable').bind(this)();
    },

    reset: function() {
        game.global.deaths += 1;
        game.state.start('play');
    },

    eatBurger: function(wabbit, burger) {
        burger.kill();
        this.numberOfBurgers -= 1 ;
        if (this.numberOfBurgers > 0) { return; }
        if (game.global.level < game.global.numLevels) {
            game.global.level += 1;
            game.state.start('play');
        }
        else {
            game.global.level = 1;
            game.state.start('menu');
        }
    },

    createWorld: function() {
        this.map = game.add.tilemap('lvl' + game.global.level);
        this.map.addTilesetImage('tileset');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
        this.map.setCollision([2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 24, 26, 27, 28]);
    },

    // Find objects in a Tiled layer that contain a property called "type" equal to a certain value
    findObjectsByGID: function(gid, map, layer) {
        var result = [];
        map.objects[layer].forEach(function(element){
            if(element.gid === gid) {
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    updateDebugTexts: function () {
        this.debugAttention.setText('A: ' + neurosky.attention);
        this.debugMeditation.setText('M: ' + neurosky.meditation);
        this.debugBlink.setText('B: ' + neurosky.blink);
        this.debugPoorSignalLevel.setText('S: ' + neurosky.poorSignalLevel);
    }
};
