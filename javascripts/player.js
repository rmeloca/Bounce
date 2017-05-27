class Player extends Phaser.Sprite {

    constructor(game, cursors, x, y, asset) {
        super(game, x, y, asset);
        this.keys = cursors;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.setSize(16, 16, 16, 16);
        this.anchor.setTo(0.5, 0.5);

        let jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jumpButton.onDown.add(this.jump, this);
    }

    jump() {
        if (this.body.onFloor()) {
            this.body.velocity.y = -350;
        }
    }

    update() {
        this.body.velocity.x = 0;

        if (this.keys.left.isDown) {
            this.body.velocity.x -= 150;
        } else if (this.keys.right.isDown) {
            this.body.velocity.x += 150;
        }

        this.animate();
    }

    animate() {
        // andando ou parado
        if (this.body.velocity.x != 0) {
            this.animations.play('walk');
        } else {
            this.animations.play('idle');
        }

        // no ar
        if (this.body.velocity.y != 0) {
            this.animations.play('jump');
        }

        // define lado
        if (this.body.velocity.x > 0) {
            this.scale.x = 1;
        } else if (this.body.velocity.x < 0) {
            this.scale.x = -1;
        }
    }
}