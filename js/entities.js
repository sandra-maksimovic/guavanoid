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

        // handle the position of the ball at the left canvas boundary
        if (x < halfPlayerWidth) {
            // to get the distance increment between the centre of the ball and the left of the canvas
            let leftInc = halfPlayerWidth - x;
            // add the increment to get the distance for the ball draw offset
            this.x = x + leftInc;
            
        // handle the position of the ball at the right canvas boundary
        } else if (x > (w - halfPlayerWidth)) {
            let distFromRight = w - x;
            // to get the distance increment between the centre of the ball and the right of the canvas
            let rightInc = (halfPlayerWidth - distFromRight);
            // subtract the increment to get the distance for the ball draw offset
            this.x = x - rightInc;
        } else {
            // place the ball centre at mouse pos x
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

        // handle the position of the paddle at the left canvas boundary
        if (x < halfPlayerWidth) {
            // to get the distance increment between the centre of the paddle and the left of the canvas
            let leftInc = halfPlayerWidth - x;
            // subtract the increment to get the distance for the paddle draw offset
            let leftOffset = halfPlayerWidth - leftInc;
            // subtract the offset from the mouse pos to keep the pointer in the middle of the paddle
            this.x = x - leftOffset;
        
        // handle the position of the paddle at the right canvas boundary
        } else if (x > (w - halfPlayerWidth)) {
            let distFromRight = w - x;
            // to get the distance increment between the centre of the paddle and the right of the canvas
            let rightInc = (halfPlayerWidth - distFromRight);
            // add the increment to get the distance for the paddle draw offset
            let rightOffset = halfPlayerWidth + rightInc;
            // subtract the offset from the mouse pos to keep the pointer in the middle of the paddle
            this.x = x - rightOffset;
        } else {
            // shift mouse pos x to the middle of the paddle
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