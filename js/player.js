class Player {
    x = '';
    y = '';
    width = '';
    height = '';
    color = '';
    lives = 3;

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        // GOOD practice: save the context, use 2D trasnformations
        ctx.save();

        // translate the coordinate system, draw relative to it
        ctx.translate(this.x, this.y);

        // draw the player with its current color
        ctx.fillStyle = this.color;

        // draw the player at its current position, width and height
        ctx.fillRect(0, 0, this.width, this.height);

        // GOOD practice: restore the context
        ctx.restore();
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