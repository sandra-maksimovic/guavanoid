"use strict";

var Guavanoid = function() {
    let canvas, ctx, w, h;
    let winDiv, loseDiv;
    let mousePos;

    let blocks = [];
    let ball, player;
    let playerStartPosX, playerStartPosY;

    let win = false;
    let lose = false;

    class Player {
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
        speedX = 5;
        speedY = -5;
        isAttached = true;

        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
        }

        set attached(isAttached) {
            this.isAttached = isAttached;
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
            this.x += this.speedX;
            this.y += this.speedY;
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

        let blockRows = 8;
        let blockCols = 6;
        let blockWidth = 50;
        let blockHeight = 20;

        // get the canvas element from the page
        canvas = document.querySelector("#gameCanvas");
        winDiv = document.querySelector("#winDiv");
        loseDiv = document.querySelector("#loseDiv");

        // get the width and height of the canvas
        w = canvas.width;
        h = canvas.height;

        playerStartPosX = (w / 2) - (playerWidth / 2);
        playerStartPosY = h - 50;

        let ballStartX = w / 2;
        let ballStartY = playerStartPosY - ballRadius;

        // create player
        player = new Player(playerStartPosX, playerStartPosY, playerWidth, playerHeight, playerColor);

        // create ball
        ball = new Ball(ballStartX, ballStartY, ballRadius, ballColor);

        // create blocks
        blocks = createBlocks(blockRows, blockCols, blockWidth, blockHeight);

        // required to draw 2d shapes to the canvas object
        ctx = canvas.getContext("2d");

        // add a mousemove event listener to the canvas to track user mouse movement
        canvas.addEventListener('mousemove', mouseMoved);

        // add a mouseclick event listener to the canvas to move the ball
        canvas.addEventListener('click', processClick);

        // start the animation
        mainLoop();
    }

    function mainLoop() {
        // clear the canvas
        ctx.clearRect(0, 0, w, h);
        
        // draw the player
        player.draw(ctx);
        
        // draw the ball
        ball.draw(ctx);

        // draw all blocks
        drawAllBlocks(blocks);

        // move the ball
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

        if (!checkWinCondition() && !lose) {
            // ask for a new animation frame
            requestAnimationFrame(mainLoop);
        }
    }

    function createBlocks(rows, cols, width, height) {
        let blockArray = [];
        let blockColor = 'grey';
        
        for (let r=0; r < rows; r++) {
            let blockY = 25;
            blockY += r*blockY;
            //let blockY = 75 + r * height;

            for (let c=0; c < cols; c++) {
                // get the left-most point (x) from the middle a column
                const colWidth = (w) / cols;
                let blockX = (colWidth / 2) - (width / 2);
                blockX += c*colWidth;

                let b = new Block(blockX, blockY, width, height, blockColor);
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

    function checkWinCondition() {
        if (blocks.length === 0) {
            win = true;

            // display win screen
            canvas.classList.add("hidden");
            winDiv.classList.remove("hidden");
        }

        return win;
    }

    function processClick(evt) {
        ball.isAttached = false;
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

    function moveBall(b) {
        b.move();    
        testCollisionBallWithWalls(b);
        testCollisionBallWithPlayer(b);
        testCollisionBallWithBlocks(b);
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
            b.speedY = -b.speedY;
            
            // put the ball at the collision point
            b.y = h - b.radius;

            // set lose condition
            lose = true;

            // display lose screen
            canvas.classList.add("hidden");
            loseDiv.classList.remove("hidden");

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

                        // remove the block from the array
                        blocks.splice(index, 1);
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

                        // remove the block from the array
                        blocks.splice(index, 1);
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

                        // remove the block from the array
                        blocks.splice(index, 1);
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

                        // remove the block from the array
                        blocks.splice(index, 1);
                    }
                }
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
        return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))< r*r);
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