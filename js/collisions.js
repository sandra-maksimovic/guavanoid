function testCollisionBallWithWalls(b, audio, canvas) {
    // COLLISION WITH VERTICAL WALLS
    if ((b.x + b.radius) > canvas.w) {
        // the ball hit the right wall
        // change horizontal direction
        b.speedX = -b.speedX;
        
        // put the ball at the collision point
        b.x = canvas.w - b.radius;
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
    if ((b.y + b.radius) > canvas.h) {
        // the ball hit the bottom wall
        // change vertical direction
        ////b.speedY = -b.speedY;
        
        // put the ball at the collision point
        ////b.y = canvas.h - b.radius;

        if (audio.sfx) { audio.failCollisionSound.play(); }
        game.playerFail();
    } else if ((b.y - b.radius) < 0) {
        // the ball hit the top wall
        // change vertical direction
        b.speedY = -b.speedY;
        
        // put the ball at the collision point
        b.y = b.radius;
    }
}

function testCollisionBallWithPlayer(b, audio, player, ballStartSpeedX) {
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

        if (audio.sfx) { audio.playerCollisionSound.play(); }

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

function testCollisionBallWithBlocks(b, audio, blocks, gameState) {
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

            if (audio.sfx) { audio.blockCollisionSound.play(); }

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
            gameState.currentScore += 1;
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