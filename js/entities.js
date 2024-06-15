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
    isBreakable = false;
    hasPickup = false;
    health = 1;
    _strokeStyle = 'white';
    
    constructor(x, y, width, height, color, isBreakable) {
        super(x, y, width, height, color);
        this.isBreakable = isBreakable;
        
        if (this.isBreakable) {
            this.health = 3;
        } else { 
            this.health = 1;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);

        if (this.isBreakable) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = this._strokeStyle;
            ctx.strokeRect(1, 1, this.width-1, this.height-1);
        }

        ctx.restore();
    }
}

class ImageButton extends Entity {
    img;
    isHovering = false;

    constructor(x, y, width, height, color, img) {
        super(x, y, width, height, color);
        this.img = img;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.drawImage(this.img, 0, 0, this.width, this.height);

        ctx.restore();
    }
}

class Overlay extends Entity {
    font;
    lineHeight;
    margin;
    radius;
    text;
    textAlign;
    textColor;
    isVisible = false;
    
    constructor(x, y, width, height, color, font, lineHeight, margin, radius, text, textAlign, textColor) {
        super(x, y, width, height, color);
        this.font = font;
        this.lineHeight = lineHeight;
        this.margin = margin;
        this.radius = radius;
        this.text = text;
        this.textAlign = textAlign;
        this.textColor = textColor;
    }

    draw(ctx) {
        const lines = this.text.split("\n");

        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.fillStyle = this.textColor;
        lines.forEach((line, index) => {
            ctx.fillText(line, this.margin, this.margin + index * this.lineHeight);
            // check whether this line contains a reference to a pickup type
            for (let i=0; i < game.pickupInit.pickupTypeArray.length; i++) {
                if (line.indexOf(game.pickupInit.pickupTypeArray[i].type) !== -1) {
                    // draw the corresponding pickup icon on the matching line
                    this.drawCircle(ctx, this.margin + (this.radius/2) + 1, this.margin + (this.radius/2) + 2 + index * this.lineHeight, game.pickupInit.pickupTypeArray[i].color);
                }
            }
        });
        ctx.fillText(this.text, this.x, this.y);

        ctx.restore();
    }
    
    drawCircle(ctx, x, y, color) {
        ctx.save();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, 2*Math.PI);
        ctx.fill();

        ctx.restore();
    }
}

class Pickup extends Ball {
    speedY;
    color;
    type;

    constructor(x, y, radius, speedY) {
        super(x, y, radius);
        this.speedY = speedY;
    }

    move() {
        this.y += this.incrementY;
    }
}

class Player extends Entity {
    lives;
    numProjectiles = 0;
    armed = false;
    sizeActive = false;

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
    color = 'red';
    incrementY;
    speedY = -300; // px/s

    move() {
        this.y += this.incrementY;
    }
}

class ResultText {
    x;
    y;
    color;
    font;
    text;
    _textAlign = "center";
    _textBaseline = "middle";

    constructor(x, y, color, font, text) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.font = font;
        this.text = text;
    }

    draw(ctx) {
        ctx.save();
        // NOTE: we don't want to translate the coordinate system for the 
        // result since we are already working in the canvas region

        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = this._textAlign;
        ctx.textBaseline = this._textBaseline;
        ctx.fillText(this.text, this.x, this.y);

        ctx.restore();
    }
}

class TextButton extends Entity {
    colorHover;
    font;
    text;
    textColor;
    textColorHover;
    textAlign;
    textBaseline;

    constructor(x, y, width, height, color, colorHover, font, text, textColor, textColorHover, textAlign, textBaseline) {
        super(x, y, width, height, color);
        this.colorHover = colorHover;
        this.font = font;
        this.text = text;
        this.textColor = textColor;
        this.textColorHover = textColorHover;
        this.textAlign = textAlign;
        this.textBaseline = textBaseline;
    }

    draw(ctx) {
        const textX = this.width / 2;
        const textY = this.height / 2;

        ctx.save();
        ctx.translate(this.x, this.y);
        
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillStyle = this.textColor;
        ctx.fillText(this.text, textX, textY);
        
        ctx.restore();
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