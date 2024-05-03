"use strict";

var Guavanoid = function() {
    let canvas, ctx, w, h;
    let winDiv, winSpan, loseDiv, loseSpan, pauseDiv;
    let mousePos;
    let totalScore = 0;
    let level = 1;

    let blocks = [];
    let ball, player;
    let playerStartPosX, playerStartPosY;
    let ballStartPosX, ballStartPosY, ballStartSpeedX, ballStartSpeedY;
    let blockCollisionSound, playerCollisionSound;

    let win = false;
    let lose = false;
    let paused = false;

    // for time based animation
    var delta, then;

    class Player {
        x = '';
        y = '';
        width = '';
        height = '';
        color = '';
        lives = 3;

        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
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

        move(x) {
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

    class Ball {
        x = '';
        y = '';
        radius = '';
        color = '';
        speedX;
        speedY;
        incrementX;
        incrementY;
        isAttached = true;

        constructor(x, y, radius, color, speedX, speedY) {
            this.x = x;
            this.y = y;
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
            //this.x += this.speedX;
            this.x += this.incrementX;
            //this.y += this.speedY;
            this.y += this.incrementY;
        }

        followPlayer(x) {
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

    class Block {
        x = '';
        y = '';
        width = '';
        height = '';
        color = '';

        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
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

    //window.onload = function init() {
    var start = function() {
        let playerWidth = 50;
        let playerHeight = 10;
        let playerColor = 'black';

        let ballRadius = 5;
        let ballColor = 'red';

        let blockRows = 6;
        let blockCols = 10;
        let blockWidth = 60;
        let blockHeight = 20;
        let blockColor = 'grey';

        // get the canvas elements from the page
        canvas = document.querySelector("#gameCanvas");
        winDiv = document.querySelector("#winDiv");
        winSpan = document.querySelector("#winSpan");
        loseDiv = document.querySelector("#loseDiv");
        loseSpan = document.querySelector("#loseSpan");
        pauseDiv = document.querySelector("#pauseDiv");

        // get the width and height of the canvas
        w = canvas.width;
        h = canvas.height;

        playerStartPosX = (w / 2) - (playerWidth / 2);
        playerStartPosY = h - 50;
        
        // create player
        player = new Player(playerStartPosX, playerStartPosY, playerWidth, playerHeight, playerColor);

        ballStartPosX = w / 2;
        ballStartPosY = playerStartPosY - ballRadius;
        //ballStartSpeedX = 5;
        ballStartSpeedX = 300; // 60 fps * 5 px = 300 px/s (time based animation)
        //ballStartSpeedY = -5;
        ballStartSpeedY = -300; // 60 fps * 5 px = 300 px/s (time based animation)

        // create ball
        ball = new Ball(ballStartPosX, ballStartPosY, ballRadius, ballColor, ballStartSpeedX, ballStartSpeedY);

        // create blocks
        blocks = createBlocks(blockRows, blockCols, blockWidth, blockHeight, blockColor);

        // required to draw 2d shapes to the canvas object
        ctx = canvas.getContext("2d");

        // add a mousemove event listener to the canvas to track user mouse movement
        canvas.addEventListener('mousemove', mouseMoved);

        // add a mouseclick event listener to the canvas to move the ball
        canvas.addEventListener('click', processClick);

        // add a keydown event listener to the window to pause the game
        document.addEventListener('keydown', processKeyDown);

        // Load embedded sounds
        blockCollisionSound = new Howl({
            src: ['data:audio/mpeg;base64,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']
        });

        playerCollisionSound = new Howl({
            src: ['data:audio/mpeg;base64,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MQ8AiATmuBwkUKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7IGToj/HFG0bpgDMgCIBolQADAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=']
        });

        // start the animation
        mainLoop();
    }

    //function mainLoop() {
    function mainLoop(now) {
        if (!paused) {
            // get the time between frames
            delta = now - then;

            ball.incrementX = calcIncrement(ball.speedX, delta);
            ball.incrementY = calcIncrement(ball.speedY, delta);

            // clear the canvas
            ctx.clearRect(0, 0, w, h);
            
            player.draw(ctx);
            ball.draw(ctx);

            drawAllBlocks(blocks);
            displayHUD(level, totalScore, player.lives);

            if (!ball.isAttached) {
                moveBall(ball);
            }

            // make the player follow the mouse
            // test if the mouse is positioned over the canvas first
            if(mousePos !== undefined) {
                //player.move(mousePos.x, mousePos.y);
                player.move(mousePos.x);
                if (ball.isAttached) {
                    ball.followPlayer(mousePos.x);
                }
            }
        }

        if (!checkWinCondition() && !checkLoseCondition()) {
            // copy the current time to the old time
            then = now;
            // ask for a new animation frame
            requestAnimationFrame(mainLoop);
        }
    }

    function calcIncrement(speed, del) {
        return (speed*del) / 1000;
    }

    function processClick(evt) {
        ball.isAttached = false;
    }

    function processKeyDown(evt) {
        if (!checkWinCondition() && !checkLoseCondition()) {
            if (evt.key === "Escape") {
                if (paused === false) {
                    paused = true;
                    pauseDiv.classList.remove("hidden");
                } else {
                    paused = false;
                    pauseDiv.classList.add("hidden");
                }
            }
        }
    }

    // called when the user moves the mouse
    function mouseMoved(evt) {
        mousePos = getMousePos(canvas, evt);
    }

    function getMousePos(canvas, evt) {
        // necessary to work in the local canvas coordinate system
        let rect = canvas.getBoundingClientRect();
        
        // we can return the mouse coords as a simple object in JS
        return { x: evt.clientX - rect.left }
    }

    function createBlocks(rows, cols, width, height, color) {
        let blockArray = [];
        let blockGap = 3;
        
        for (let r=0; r < rows; r++) {
            let blockY;
            let blockYSpacing = height + blockGap;
            let topGapY = 50;

            if (r === 0) {
                blockY = topGapY; 
            } else {
                blockY = topGapY + r*blockYSpacing;
            }

            for (let c=0; c < cols; c++) {
                let blockX;
                let blockXSpacing = width + blockGap;
                let leftGapX = (w - blockXSpacing*cols) / 2;

                if (c === 0) {
                    blockX = leftGapX;
                } else {
                    blockX = leftGapX + c*blockXSpacing;
                }

                let b = new Block(blockX, blockY, width, height, color);
                blockArray.push(b);
            }
        }

        // returns the array of blocks
        return blockArray;
    }

    function drawAllBlocks(blockArray) {
        blockArray.forEach(function(b) {
            b.draw(ctx);
        });
    }

    function moveBall(b) {
        b.move();    
        testCollisionBallWithWalls(b);
        testCollisionBallWithPlayer(b);
        testCollisionBallWithBlocks(b);
    }

    function displayHUD(lvl, score, lives) {
        let hudXLeftAlign = 40;
        let hudXCenterAlign = w / 2;
        let huxXRightAlign = w - 40;
        let hudYTopAlign = 5;

        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        ctx.fillText(`Level: ${lvl}`, hudXLeftAlign, hudYTopAlign);
        ctx.textAlign = "center";
        ctx.fillText(`Score: ${score}`, hudXCenterAlign, hudYTopAlign);
        ctx.textAlign = "right";
        ctx.fillText(`Lives: ${lives}`, huxXRightAlign, hudYTopAlign);
    }

    function checkWinCondition() {
        if (blocks.length === 0) {
            win = true;

            // display win screen
            canvas.classList.add("hidden");
            winDiv.classList.remove("hidden");
            winSpan.textContent = "Score: " + totalScore;
        }

        return win;
    }

    function checkLoseCondition() {
        if (player.lives < 0) {
            lose = true;

            // display lose screen
            canvas.classList.add("hidden");
            loseDiv.classList.remove("hidden");
            loseSpan.textContent = "Score: " + totalScore;
        }

        return lose;
    }

    function playerFail() {
        player.lives -= 1;
        ball.isAttached = true;
        ball.x = ballStartPosX;
        ball.y = ballStartPosY;
    }

    function testCollisionBallWithWalls(b) {
        // COLLISION WITH VERTICAL WALLS
        if ((b.x + b.radius) > w) {
            // the ball hit the right wall
            // change horizontal direction
            b.speedX = -b.speedX;
            
            // put the ball at the collision point
            b.x = w - b.radius;
        } else if ((b.x - b.radius) < 0) {
            // the ball hit the left wall
            // change horizontal direction
            b.speedX = -b.speedX;
            
            // put the ball at the collision point
            b.x = b.radius;
        }
    
        // COLLISIONS WTH HORIZONTAL WALLS
        // Not in the else as the ball can touch both
        // vertical and horizontal walls in corners
        if ((b.y + b.radius) > h) {
            // the ball hit the bottom wall
            // change vertical direction
            ////b.speedY = -b.speedY;
            
            // put the ball at the collision point
            ////b.y = h - b.radius;

            playerFail();
        } else if ((b.y - b.radius) < 0) {
            // the ball hit the top wall
            // change vertical direction
            b.speedY = -b.speedY;
            
            // put the ball at the collision point
            b.y = b.radius;
        }
    }

    function testCollisionBallWithPlayer(b) {
        if(circRectsOverlap(player.x, player.y, player.width, player.height, b.x, b.y, b.radius)) {
            let ballRightSide = b.x + b.radius;
            let ballLeftSide = b.x - b.radius;
            let playerRightSide = player.x + player.width;
            let playerLeftSide = player.x;

            let ballTopSide = b.y - b.radius;
            let ballBottomSide = b.y + b.radius;
            let playerTopSide = player.y;
            let playerBottomSide = player.y + player.height;

            let ballGoingRight = b.speedX > 0;
            let ballGoingLeft = b.speedX < 0;
            let ballGoingUp = b.speedY < 0;
            let ballGoingDown = b.speedY > 0;

            playerCollisionSound.play();

            // check if the ball hit the LEFT side of the player
            if (ballRightSide > playerLeftSide && ballGoingRight) {
                    
                // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                if (b.y > playerTopSide && b.y < playerBottomSide) {
                    // change horizontal direction
                    b.speedX = -b.speedX;
                    ballGoingRight = false;
                    ballGoingLeft = true;
                    
                    // put the ball at the collision point
                    b.x = ballLeftSide - b.radius;
                    
                    // update the horizontal ball bounds
                    ballLeftSide = b.x - b.radius;
                    ballRightSide = b.x + b.radius;
                }

            // otherwise check if the ball hit the RIGHT side of the player
            } else if (ballLeftSide < playerRightSide && ballGoingLeft) {
                    
                // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                if (b.y > playerTopSide && b.y < playerBottomSide) {
                    // change horizontal direction
                    b.speedX = -b.speedX;
                    ballGoingLeft = false;
                    ballGoingRight = true;
                    
                    // put the ball at the collision point
                    b.x = playerRightSide + b.radius;

                    // update the horizontal ball bounds
                    ballRightSide = b.x + b.radius;
                    ballLeftSide = b.x - b.radius;
                }
            }

            // check if the ball hit the TOP side of the player
            if (ballBottomSide > playerTopSide && ballGoingDown) {

                // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                if (b.x > playerLeftSide && b.x < playerRightSide) {
                    let segment1 = player.x + (player.width / 5);
                    let segment2 = player.x + (player.width / 5)*2;
                    let segment3 = player.x + (player.width / 5)*3;
                    let segment4 = player.x + (player.width / 5)*4;
                    let segment5 = playerRightSide;
                    let fullSpeedX = ballStartSpeedX;
                    let medSpeedX = fullSpeedX*0.6;
                    let lowSpeedX = fullSpeedX*0.2;

                    // change horiztonal direction by different amount
                    // to simulate a change of angle
                    if (b.x > playerLeftSide  && b.x < segment1) {
                        if (b.speedX > 0) { b.speedX = fullSpeedX; }
                        else if (b.speedX < 0) { b.speedX = -fullSpeedX; }
                    } else if (b.x > segment1 && b.x < segment2) {
                        if (b.speedX > 0) { b.speedX = medSpeedX; }
                        else if (b.speedX < 0) { b.speedX = -medSpeedX; }
                    } else if (b.x > segment2 && b.x < segment3) {
                        if (b.speedX > 0) { b.speedX = lowSpeedX; }
                        else if (b.speedX < 0) { b.speedX = -lowSpeedX; }
                    } else if (b.x > segment3 && b.x < segment4) {
                        if (b.speedX > 0) { b.speedX = medSpeedX; }
                        else if (b.speedX < 0) { b.speedX = -medSpeedX; }
                    } else if (b.x > segment4 && b.x < segment5) {
                        if (b.speedX > 0) { b.speedX = medSpeedX; }
                        else if (b.speedX < 0) { b.speedX = -medSpeedX; }
                    }

                    // change vertical direction
                    b.speedY = -b.speedY;
                    ballGoingDown = false;
                    ballGoingUp = true;
                    
                    // put the ball at the collision point
                    b.y = playerTopSide - b.radius;

                    // update the vertical ball bounds
                    ballTopSide = b.y - b.radius;
                    ballBottomSide = b.y + b.radius;
                }
            
            // otherwise check if the ball hit the BOTTOM side of the player
            } else if (ballTopSide < playerBottomSide && ballGoingUp) {

                // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                if (b.x > playerLeftSide && b.x < playerRightSide) {
                    // change vertical direction
                    b.speedY = -b.speedY;
                    ballGoingUp = false;
                    ballGoingDown = true;
                    
                    // put the ball at the collision point
                    b.y = playerBottomSide + b.radius;

                    // update the vertical ball bounds
                    ballBottomSide = b.y + b.radius;
                    ballTopSide = b.y - b.radius;
                }
            }
        }
    }

    function testCollisionBallWithBlocks(b) {
        blocks.forEach(function(block, index) {
            if(circRectsOverlap(block.x, block.y, block.width, block.height, b.x, b.y, b.radius)) {
                let ballRightSide = b.x + b.radius;
                let ballLeftSide = b.x - b.radius;
                let blockRightSide = block.x + block.width;
                let blockLeftSide = block.x;

                let ballTopSide = b.y - b.radius;
                let ballBottomSide = b.y + b.radius;
                let blockTopSide = block.y;
                let blockBottomSide = block.y + block.height;

                let ballGoingRight = b.speedX > 0;
                let ballGoingLeft = b.speedX < 0;
                let ballGoingUp = b.speedY < 0;
                let ballGoingDown = b.speedY > 0;

                blockCollisionSound.play();

                // check if the ball hit the LEFT side of the block
                if (ballRightSide > blockLeftSide && ballGoingRight) {
                    
                    // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                    if (b.y > blockTopSide && b.y < blockBottomSide) {
                        // change horizontal direction
                        b.speedX = -b.speedX;
                        ballGoingRight = false;
                        ballGoingLeft = true;
                        
                        // put the ball at the collision point
                        b.x = ballLeftSide - b.radius;
                        
                        // update the horizontal ball bounds
                        ballLeftSide = b.x - b.radius;
                        ballRightSide = b.x + b.radius;
                    }
                
                // otherwise check if the ball hit the RIGHT side of the block
                } else if (ballLeftSide < blockRightSide && ballGoingLeft) {
                    
                    // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                    if (b.y > blockTopSide && b.y < blockBottomSide) {
                        // change horizontal direction
                        b.speedX = -b.speedX;
                        ballGoingLeft = false;
                        ballGoingRight = true;
                        
                        // put the ball at the collision point
                        b.x = blockRightSide + b.radius;

                        // update the horizontal ball bounds
                        ballRightSide = b.x + b.radius;
                        ballLeftSide = b.x - b.radius;
                    }
                }
                
                // check if the ball hit the TOP side of the block
                if (ballBottomSide > blockTopSide && ballGoingDown) {

                    // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                    if (b.x > blockLeftSide && b.x < blockRightSide) {
                        // change vertical direction
                        b.speedY = -b.speedY;
                        ballGoingDown = false;
                        ballGoingUp = true;
                        
                        // put the ball at the collision point
                        b.y = blockTopSide - b.radius;

                        // update the vertical ball bounds
                        ballTopSide = b.y - b.radius;
                        ballBottomSide = b.y + b.radius;
                    }
                
                // otherwise check if the ball hit the BOTTOM side of the block
                } else if (ballTopSide < blockBottomSide && ballGoingUp) {

                    // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                    if (b.x > blockLeftSide && b.x < blockRightSide) {
                        // change vertical direction
                        b.speedY = -b.speedY;
                        ballGoingUp = false;
                        ballGoingDown = true;
                        
                        // put the ball at the collision point
                        b.y = blockBottomSide + b.radius;

                        // update the vertical ball bounds
                        ballBottomSide = b.y + b.radius;
                        ballTopSide = b.y - b.radius;
                    }
                }

                // remove the block from the array
                blocks.splice(index, 1);

                // increment the score
                totalScore += 1;
            }
        });
    }

    // UTILITY FUNCTION
    // test collisions between rectangle and circle
    function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
        let testX=cx;
        let testY=cy;
        if (testX < x0) testX=x0; // test left
        if (testX > (x0+w0)) testX=(x0+w0); // test right
        if (testY < y0) testY=y0; // test top
        if (testY > (y0+h0)) testY=(y0+h0); // test bottom
        return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY)) < r*r); // to avoid expensive sqrt calc
    }

    return {
        start: start
    };
}

window.onload = function init() {
    let startButton = document.querySelector("#startButton");
    let startDiv = document.querySelector("#startDiv");
    let gameCanvas = document.querySelector("#gameCanvas");

    startButton.addEventListener('click', function(evt) {
        startButton.classList.add("hidden");
        startDiv.classList.add("hidden");
        gameCanvas.classList.remove("hidden");
        
        var game = new Guavanoid();
        game.start();
    });
}