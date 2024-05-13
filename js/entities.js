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

    set incX(incrementX) {
        this.incrementX = incrementX;
    }

    set incY(incrementY) {
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
    pickup = false;
    
    constructor(x, y, width, height, color, health, colorArray) {
        super(x, y, width, height, color);
        this.health = health;
        this.colorArray = colorArray;
    }

    set color(color) {
        this.color = color;
    }

    set pickup(pickup) {
        this.pickup = pickup;
    }
}

class Pickup extends Ball {
    constructor(x, y, radius, color, speedY) {
        super(x, y, radius, color, speedY);
    }

    move() {
        this.y += this.incrementY;
    }
}

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

class Wall extends Entity {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }
}