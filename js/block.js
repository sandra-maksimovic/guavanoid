class Block extends Entity {
    constructor(x, y, width, height, color, health) {
        super(x, y, width, height, color);
        this.health = health;
    }

    set color(color) {
        this.color = color;
    }
}