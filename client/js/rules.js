rules = {
    methods: {
        classicHorizontalMove: function () {
            // Horizontal movement
            if (this.cursor.left.isDown) {
                this.wabbit.body.velocity.x = -1 * this.horizontalSpeed;
            } else if (this.cursor.right.isDown) {
                this.wabbit.body.velocity.x = this.horizontalSpeed;
            } else {
                this.wabbit.body.velocity.x = 0;
            }
        },
        classicJump: function () {
            // Classic jump
            if (this.cursor.up.isDown && this.wabbit.body.onFloor()) {
                this.wabbit.body.velocity.y = -1 * this.jumpSpeed * 2;
            }
        },
        blinkJump: function () {
            if (neurosky.blink > 30) {
                this.wabbit.body.velocity.y = -1 * this.jumpSpeed * 2;
            }
        },
        attentionFly: function () {
            if (neurosky.attention > this.flyThreshold) {
                this.wabbit.body.velocity.y = -1 * this.jumpSpeed;
            }
        },
        godModeMove: function () {
            // Horizontal movement
            if (this.cursor.left.isDown) {
                this.wabbit.body.velocity.x = -1 * this.horizontalSpeed;
            } else if (this.cursor.right.isDown) {
                this.wabbit.body.velocity.x = this.horizontalSpeed;
            } else {
                this.wabbit.body.velocity.x = 0;
            }
            // Vertical movement
            if (this.cursor.up.isDown) {
                this.wabbit.body.velocity.y = -2 * this.jumpSpeed;
            } else if (this.cursor.down.isDown) {
                this.wabbit.body.velocity.y = 2 * this.jumpSpeed;
            } else {
                this.wabbit.body.velocity.y = 0;
            }
        }
    },
    defaults: {
        move: function () {
            rules.methods.classicHorizontalMove.bind(this)();
            rules.methods.attentionFly();
        },
        jump: function () { rules.methods.classicJump.bind(this)() }
    }
};
