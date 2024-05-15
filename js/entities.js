class Ball extends Entity {
    radius;
    color;
    speedX;
    speedY;
    incrementX;
    incrementY;
    isAttached = true;

    constructor(x, y, radius, color, speedX, speedY) {
        super(x, y);
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    set attached(isAttached) {
        this.isAttached = isAttached;
    }

    set incrementX(incrementX) {
        this.incrementX = incrementX;
    }

    set incrementY(incrementY) {
        this.incrementY = incrementY;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.restore();    
    }

    move() {
        this.x += this.incrementX;
        this.y += this.incrementY;
    }

    followPlayer(x, player, w) {
        const halfPlayerWidth = player.width / 2;

        if (x < halfPlayerWidth) {
            this.x = x + halfPlayerWidth;
        } else if (x > (w - halfPlayerWidth)) {
            this.x = x - halfPlayerWidth;
        } else {
            this.x = x;
        }
    }
}

class Block extends Entity {
    health;
    colorArray; // for breakable blocks
    hasPickup = false;
    
    constructor(x, y, width, height, color, health, colorArray) {
        super(x, y, width, height, color);
        this.health = health;
        this.colorArray = colorArray;
    }

    set color(color) {
        this.color = color;
    }

    set hasPickup(hasPickup) {
        this.hasPickup = hasPickup;
    }
}

class Pickup extends Ball {
    type;

    constructor(x, y, radius, color, speedX, speedY) {
        super(x, y, radius, color, speedX, speedY);
    }

    set color(color) {
        this.color = color;
    }

    set type(type) {
        this.type = type;
    }

    move() {
        this.y += this.incrementY;
    }
}

class Player extends Entity {
    growthActive = false;
    laserActive = false;
    lives;

    constructor(x, y, width, height, color, lives) {
        super(x, y, width, height, color);
        this.lives = lives;
    }

    set growthActive(bool) {
        this.growthActive = bool;
    }

    set lives(lives) {
        this.lives = lives;
    }

    set width(width) {
        this.width = width;
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

class Wall extends Entity {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }
}