rules = {

    // Some standard methods that might be used multiple places
    methods: {
        classicHorizontalMove: function () {
            // Horizontal movement
            if (this.cursor.left.isDown) {
                this.player.body.velocity.x = -1 * this.horizontalSpeed;
            } else if (this.cursor.right.isDown) {
                this.player.body.velocity.x = this.horizontalSpeed;
            } else {
                this.player.body.velocity.x = 0;
            }
        },
        classicJump: function () {
            if (this.cursor.up.isDown && (this.player.body.onFloor() || this.playerIsStandingOnMovable())) {
                this.player.body.velocity.y = -1 * this.jumpSpeed * 2;
            }
        },
        blinkJump: function () {
            if (neurosky.blink > 30 && this.player.body.onFloor()) {
                this.player.body.velocity.y = -1 * this.jumpSpeed * 4;
                neurosky.blink = 0;
            }
        },
        attentionFly: function () {
            if (neurosky.attention > 40) {
                this.player.body.velocity.y = -1 * this.jumpSpeed;
            }
        },
        blinkFall: function () {
            if (neurosky.blink > 30) {
                this.player.body.velocity.y = this.jumpSpeed;
            }
        },
        moveAndFly: function () {
            rules.methods.classicHorizontalMove.bind(this)();
            rules.methods.attentionFly.bind(this)();
            rules.methods.blinkFall.bind(this)();
        },
        godModeMove: function () {
            // Horizontal movement
            rules.methods.classicHorizontalMove.bind(this)();
            // Vertical movement
            if (this.cursor.up.isDown) {
                this.player.body.velocity.y = -2 * this.jumpSpeed;
            } else if (this.cursor.down.isDown) {
                this.player.body.velocity.y = 2 * this.jumpSpeed;
            } else {
                this.player.body.velocity.y = 0;
            }
        }
    },

    // Default behavior for levels that not have been specifically configured.
    defaults: {
        move: function () { rules.methods.moveAndFly.bind(this)(); },
        jump: function () { rules.methods.classicJump.bind(this)(); },
        movableObject: '',
        moveMovable: function () {},
        overlapMovable: function () {}
    },

    // Function that returns requested property for given level. If it doesn't exist, the default is used.
    get: function (lvlNumber, propertyName) {
        if (rules.hasOwnProperty('lvl' + lvlNumber) && rules['lvl' + lvlNumber].hasOwnProperty(propertyName)) {
            return rules['lvl' + lvlNumber][propertyName];
        }
        return rules.defaults[propertyName];
    },

    // (Optional) Specific configuration for each level follows. Object name must start with 'lvl' followed by number of level.
    lvl2: {
        move: function () { rules.methods.classicHorizontalMove.bind(this)(); },
        movableObject: 'stone',
        moveMovable: function () {
            if (this.movables.children.length === 0) return;
            var stone = this.movables.getTop();
            var target = 180 - neurosky.attention * 2;
            var distance = target - stone.y;

            if (Math.abs(distance) < 5) {
                stone.body.velocity.y = 0;
            } else if (Math.sign(distance) === 1) {
                stone.body.velocity.y = 60;
            } else {
                stone.body.velocity.y = Math.sign(distance) * 30;
            }
        },
        overlapMovable: function () {
            const stone = this.movables.getTop();
            if (!stone || stone.body.velocity.y <= 0) return;
            var boundsA = stone.getBounds();
            var boundsB = this.player.getBounds();
            if (Phaser.Rectangle.intersects(boundsA, boundsB) && this.player.body.onFloor()) {
                this.reset();
            }
        }
    },
    lvl3: {
        move: function () { rules.methods.classicHorizontalMove.bind(this)(); },
        movableObject: 'elevator',
        moveMovable: function () {
            if (this.movables.children.length === 0) return;
            var target = 510 - 4 * neurosky.attention;
            var elevator = this.movables.getTop();
            var distance = target - elevator.y;
            elevator.body.velocity.y = (Math.abs(distance) < 5) ? 0 : Math.sign(distance) * 30;
        }
    },
    lvl7: {
        move: function () { rules.methods.classicHorizontalMove.bind(this)(); },
        jump: function () { rules.methods.blinkJump.bind(this)(); }
    }
};
