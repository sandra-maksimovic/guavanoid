class Player extends Entity {
    lives = 3;

    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }

    move(x, w) {
        const halfPlayerWidth = this.width / 2;

        if (x < halfPlayerWidth) {
            this.x = x;
        } else if (x > (w - halfPlayerWidth)) {
            this.x = x - this.width;
        } else {
            this.x = x - halfPlayerWidth;
        }
    }
}