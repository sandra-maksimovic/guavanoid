class Block {
    x = '';
    y = '';
    width = '';
    height = '';
    color = '';
    health = '';

    constructor(x, y, width, height, color, health) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.health = health;
    }

    set color(color) {
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
}