class Block extends Entity {
    health;
    
    constructor(x, y, width, height, color, health) {
        super(x, y, width, height, color);
        this.health = health;
    }

    set color(color) {
        this.color = color;
    }
}