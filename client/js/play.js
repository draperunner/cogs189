var playState = {

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Keyboard
        this.cursor = game.input.keyboard.createCursorKeys();
        this.r = game.input.keyboard.addKey(Phaser.Keyboard.R);

        // Level
        this.createWorld();

        // Wabbit

        var result = this.findObjectsByGID(4, this.map, 'Object Layer 1');
        this.wabbit = game.add.sprite(result[0].x, result[0].y, 'wabbit');
        this.wabbit.anchor.setTo(0.5, 1);
        game.physics.arcade.enable(this.wabbit);
        this.wabbit.body.gravity.y = 500;
        this.wabbit.body.collideWorldBounds = true;

        // Create burgers
        this.burgers = game.add.group();
        this.burgers.enableBody = true;
        this.map.createFromObjects('Object Layer 1', 3, 'burger', 0, true, false, this.burgers);
        numberOfBurgers = this.burgers.length;

        // Create lava (deadly tiles)
        this.map.setTileIndexCallback(5, this.reset, this);

    },

    update: function() {
        game.physics.arcade.collide(this.wabbit, this.layer);
        game.physics.arcade.overlap(this.wabbit, this.burgers, this.eatBurger, null, this);
        this.movePlayer();
        if (this.r.isDown) {
            this.reset();
        }
    },

    movePlayer: function() {
        if (this.cursor.left.isDown) {
            this.wabbit.body.velocity.x = -300;
        }
        else if (this.cursor.right.isDown) {
            this.wabbit.body.velocity.x = 300;
        }
        else {
            this.wabbit.body.velocity.x = 0;
        }
        if (this.cursor.up.isDown && this.wabbit.body.onFloor()) {
            this.wabbit.body.velocity.y = -500;
        }
    },

    reset: function() {
        game.global.deaths += 1;
        game.state.start('play');
    },

    eatBurger: function(wabbit, burger) {
        burger.kill();
        wabbit.body.gravity.y += 150;
        numberOfBurgers -= 1 ;
        if (numberOfBurgers <= 0) {
            if (game.global.level < 3) {
                game.global.level += 1;
                game.state.start('play');
            }
            else {
                game.global.level = 1;
                game.state.start('menu');
            }

        }
    },

    createWorld: function() {
        this.map = game.add.tilemap('lvl' + game.global.level);
        this.map.addTilesetImage('tileset');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
        this.map.setCollision([1, 2]);
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
    }
};
