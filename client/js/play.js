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
        this.originalX = result[0].x;
        this.originalY = result[0].y;
        this.wabbit = game.add.sprite(this.originalX, this.originalY, 'wabbit');

        this.wabbit.anchor.setTo(0.5, 1);
        game.physics.arcade.enable(this.wabbit);

        this.wabbit.body.gravity.y = (!game.global.debug) ? 500 : 0;
        this.wabbit.body.collideWorldBounds = true;

        this.horizontalSpeed = 300;
        this.jumpSpeed = 100;

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

        // Sprite used to flash screen when blinking
        this.whiteFlash = this.game.add.sprite(0, 0, 'whiteFlash');
        this.whiteFlash.alpha = 0;
        this.whiteFlash.flash = function () {
            var t = game.add.tween(this).to({alpha:1}, 50).start();
            t.onComplete.add(function () {
                game.add.tween(this).to({alpha:0}, 100).start();
            }, this);
        };

        // Sprite used to flash screen when killed. Resets game when done!
        this.redFlash = this.game.add.sprite(0, 0, 'redFlash');
        this.redFlash.alpha = 0;
        this.redFlash.flash = function () {
            var t = game.add.tween(this).to({alpha:1}, 50).start();
            t.onComplete.add(function () {
                game.add.tween(this).to({alpha:0}, 500).start();
            }, this);
        };
    },

    update: function() {
        game.physics.arcade.collide(this.wabbit, this.layer);
        game.physics.arcade.collide(this.wabbit, this.movables);
        game.physics.arcade.collide(this.layer, this.movables);
        game.physics.arcade.overlap(this.wabbit, this.burgers, this.eatBurger, null, this);
        rules.get(game.global.level, 'overlapMovable').bind(this)();

        if (this.r.isDown) {
            this.reset();
        }

        rules.get(game.global.level, 'moveMovable').bind(this)();

        this.updateDebugTexts();
        if (game.global.debug) {
            rules.methods.godModeMove.bind(this)();
            return;
        }
        rules.get(game.global.level, 'move').bind(this)();
        rules.get(game.global.level, 'jump').bind(this)();
    },

    reset: function() {
        game.global.deaths += 1;
        this.redFlash.flash();
        this.wabbit.reset(this.originalX, this.originalY);
    },

    eatBurger: function(wabbit, burger) {
        burger.kill();
        this.numberOfBurgers -= 1 ;
        if (this.numberOfBurgers > 0) { return; }
        if (game.global.level < game.global.numLevels) {
            game.global.level += 1;
            this.wabbit.anchor.setTo(0.5, 0.5);
            this.wabbit.y -= this.wabbit.height / 2;
            game.add.tween(this.wabbit).to({angle:360, y:this.wabbit.y-60}, 400).start().onComplete.add(function () {
                game.state.start('play');
            });
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
    },

    // Returns true if the wabbit is touching a movableObject (elevator or stone)
    wabbitIsStandingOnMovable: function () {
        const movable = this.movables.getTop();
        if (!movable) return false;
        const boundsA = movable.getBounds();
        const boundsB = this.wabbit.getBounds();
        const wabbitBottom = new Phaser.Rectangle(boundsB.bottomLeft.x, boundsB.bottomLeft.y, boundsB.width, 1);
        return Phaser.Rectangle.intersects(boundsA, wabbitBottom);
    }
};
