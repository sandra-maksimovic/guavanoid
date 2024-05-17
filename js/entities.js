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
}

class Pickup extends Ball {
    type;

    constructor(x, y, radius, color, speedX, speedY) {
        super(x, y, radius, color, speedX, speedY);
    }

    move() {
        this.y += this.incrementY;
    }
}

class Player extends Entity {
    growthActive = false;
    lives;
    numProjectiles = 0;
    projectileFired = false;

    constructor(x, y, width, height, color, lives, numProjectiles) {
        super(x, y, width, height, color);
        this.lives = lives;
        this.numProjectiles = numProjectiles;
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

class Projectile extends Entity {
    x;
    y;
    width = 4;
    height = 15;
    color = 'orange';
    incrementY;
    speedY = -300; // px/s

    move() {
        this.y += this.incrementY;
    }
}

class Wall extends Entity {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }
}