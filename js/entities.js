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
    hasPickup = false;
    isBreakable = false;
    
    constructor(x, y, width, height, color, isBreakable) {
        super(x, y, width, height, color);
        this.isBreakable = isBreakable;
        
        if (this.isBreakable) { this.health = 3; }
        else { this.health = 1; }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        if (this.isBreakable) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'white';
            ctx.strokeRect(1, 1, this.width-1, this.height-1);
        }
        ctx.restore();
    }
}

class Button extends Entity {
    text;
    textColor;

    constructor(x, y, width, height, color, text, textColor) {
        super(x, y, width, height, color);
        this.text = text;
        this.textColor = textColor;
    }

    draw(ctx) {
        const textX = this.width / 2;
        const textY = this.height / 2;

        ctx.save();
        ctx.translate(this.x, this.y);
        
        // button
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // button text
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.textColor;
        ctx.fillText(this.text, textX, textY);
        
        ctx.restore();
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
    strokeColor;

    constructor(x, y, width, height, color, strokeColor) {
        super(x, y, width, height, color);
        this.strokeColor = strokeColor;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.strokeColor;
        ctx.strokeRect(1, 1, this.width-1, this.height-1);
        ctx.restore();
    }
}