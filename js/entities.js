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
        // GOOD practice: save the context, use 2D trasnformations
        ctx.save();
    
        // translate the coordinate system, draw relative to it
        ctx.translate(this.x, this.y);
        
        // draw the ball with its current color
        ctx.fillStyle = this.color;
        
        // draw the ball at its current position
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
        ctx.fill();
    
        // GOOD practice: restore the context
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
    
    constructor(x, y, width, height, color, health) {
        super(x, y, width, height, color);
        this.health = health;
    }

    set color(color) {
        this.color = color;
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