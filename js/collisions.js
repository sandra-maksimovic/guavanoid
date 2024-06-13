function testCollisionBallWithWalls(ball) {
    // COLLISION WITH VERTICAL WALLS
    if ((ball.x + ball.radius) > game.canvas.w) {
        // the ball hit the right wall
        // change horizontal direction
        ball.speedX = -ball.speedX;
        
        // put the ball at the collision point
        ball.x = game.canvas.w - ball.radius;
    } else if ((ball.x - ball.radius) < 0) {
        // the ball hit the left wall
        // change horizontal direction
        ball.speedX = -ball.speedX;
        
        // put the ball at the collision point
        ball.x = ball.radius;
    }

    // COLLISIONS WTH HORIZONTAL WALLS
    // Not in the else as the ball can touch both
    // vertical and horizontal walls in corners
    if ((ball.y + ball.radius) > game.canvas.h) {
        // the ball hit the bottom wall
        // change vertical direction
        //ball.speedY = -ball.speedY;
        
        // put the ball at the collision point
        //ball.y = game.canvas.h - ball.radius;

        playSound(game.audio.failCollisionSound);
        game.playerFail();
    } else if ((ball.y - ball.radius) < 0) {
        // the ball hit the top wall
        // change vertical direction
        ball.speedY = -ball.speedY;
        
        // put the ball at the collision point
        ball.y = ball.radius;
    }
}

function testCollisionBallWithPlayer(ball) {
    if(circRectsOverlap(game.player.x, game.player.y, game.player.width, game.player.height, ball.x, ball.y, ball.radius)) {
        let ballRightSide = ball.x + ball.radius;
        let ballLeftSide = ball.x - ball.radius;
        let playerRightSide = game.player.x + game.player.width;
        let playerLeftSide = game.player.x;

        let ballTopSide = ball.y - ball.radius;
        let ballBottomSide = ball.y + ball.radius;
        let playerTopSide = game.player.y;
        let playerBottomSide = game.player.y + game.player.height;

        let ballGoingRight = ball.speedX > 0;
        let ballGoingLeft = ball.speedX < 0;
        let ballGoingUp = ball.speedY < 0;
        let ballGoingDown = ball.speedY > 0;

        // check if the ball hit the LEFT side of the player
        if (ballRightSide > playerLeftSide && ballGoingRight) {
                
            // also check if the ball centre is within the TOP & BOTTOM bounds of the block
            if (ball.y > playerTopSide && ball.y < playerBottomSide) {
                // change horizontal direction
                ball.speedX = -ball.speedX;
                ballGoingRight = false;
                ballGoingLeft = true;
                
                // put the ball at the collision point
                ball.x = ballLeftSide - ball.radius;
                
                // update the horizontal ball bounds
                ballLeftSide = ball.x - ball.radius;
                ballRightSide = ball.x + ball.radius;
            }

        // otherwise check if the ball hit the RIGHT side of the player
        } else if (ballLeftSide < playerRightSide && ballGoingLeft) {
                
            // also check if the ball centre is within the TOP & BOTTOM bounds of the block
            if (ball.y > playerTopSide && ball.y < playerBottomSide) {
                // change horizontal direction
                ball.speedX = -ball.speedX;
                ballGoingLeft = false;
                ballGoingRight = true;
                
                // put the ball at the collision point
                ball.x = playerRightSide + ball.radius;

                // update the horizontal ball bounds
                ballRightSide = ball.x + ball.radius;
                ballLeftSide = ball.x - ball.radius;
            }
        }

        // check if the ball hit the TOP side of the player
        if (ballBottomSide > playerTopSide && ballGoingDown) {

            // also check if the ball centre is within the LEFT & RIGHT bounds of the block
            if (ball.x > playerLeftSide && ball.x < playerRightSide) {
                let segment1 = game.player.x + (game.player.width / 5);
                let segment2 = game.player.x + (game.player.width / 5)*2;
                let segment3 = game.player.x + (game.player.width / 5)*3;
                let segment4 = game.player.x + (game.player.width / 5)*4;
                let segment5 = playerRightSide;
                let fullSpeedX = game.ballInit.ballStartSpeedX;
                let medSpeedX = fullSpeedX*0.6;
                let lowSpeedX = fullSpeedX*0.2;

                // change ball horizontal speed based on where 
                // it hit the paddle to simulate a change of angle
                if (ball.x > playerLeftSide  && ball.x < segment1) {
                    if (ball.speedX > 0) { ball.speedX = fullSpeedX; }
                    else if (ball.speedX < 0) { ball.speedX = -fullSpeedX; }
                } else if (ball.x > segment1 && ball.x < segment2) {
                    if (ball.speedX > 0) { ball.speedX = medSpeedX; }
                    else if (ball.speedX < 0) { ball.speedX = -medSpeedX; }
                } else if (ball.x > segment2 && ball.x < segment3) {
                    if (ball.speedX > 0) { ball.speedX = lowSpeedX; }
                    else if (ball.speedX < 0) { ball.speedX = -lowSpeedX; }
                } else if (ball.x > segment3 && ball.x < segment4) {
                    if (ball.speedX > 0) { ball.speedX = medSpeedX; }
                    else if (ball.speedX < 0) { ball.speedX = -medSpeedX; }
                } else if (ball.x > segment4 && ball.x < segment5) {
                    if (ball.speedX > 0) { ball.speedX = medSpeedX; }
                    else if (ball.speedX < 0) { ball.speedX = -medSpeedX; }
                }

                // change vertical direction
                ball.speedY = -ball.speedY;
                ballGoingDown = false;
                ballGoingUp = true;
                
                // put the ball at the collision point
                ball.y = playerTopSide - ball.radius;

                // update the vertical ball bounds
                ballTopSide = ball.y - ball.radius;
                ballBottomSide = ball.y + ball.radius;
            }
        
        // otherwise check if the ball hit the BOTTOM side of the player
        } else if (ballTopSide < playerBottomSide && ballGoingUp) {

            // also check if the ball centre is within the LEFT & RIGHT bounds of the block
            if (ball.x > playerLeftSide && ball.x < playerRightSide) {
                // change vertical direction
                ball.speedY = -ball.speedY;
                ballGoingUp = false;
                ballGoingDown = true;
                
                // put the ball at the collision point
                ball.y = playerBottomSide + ball.radius;

                // update the vertical ball bounds
                ballBottomSide = ball.y + ball.radius;
                ballTopSide = ball.y - ball.radius;
            }
        }

        playSound(game.audio.playerCollisionSound);
    }
}

function testCollisionBallWithBlocks(ball) {
    game.blocks.forEach(function(block, index) {
        if(circRectsOverlap(block.x, block.y, block.width, block.height, ball.x, ball.y, ball.radius)) {
            let ballRightSide = ball.x + ball.radius;
            let ballLeftSide = ball.x - ball.radius;
            let blockRightSide = block.x + block.width;
            let blockLeftSide = block.x;

            let ballTopSide = ball.y - ball.radius;
            let ballBottomSide = ball.y + ball.radius;
            let blockTopSide = block.y;
            let blockBottomSide = block.y + block.height;

            let ballGoingRight = ball.speedX > 0;
            let ballGoingLeft = ball.speedX < 0;
            let ballGoingUp = ball.speedY < 0;
            let ballGoingDown = ball.speedY > 0;

            // check if the ball hit the LEFT side of the block
            if (ballRightSide > blockLeftSide && ballGoingRight) {
                
                // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                if (ball.y > blockTopSide && ball.y < blockBottomSide) {
                    // change horizontal direction
                    ball.speedX = -ball.speedX;
                    ballGoingRight = false;
                    ballGoingLeft = true;
                    
                    // put the ball at the collision point
                    ball.x = ballLeftSide - ball.radius;
                    
                    // update the horizontal ball bounds
                    ballLeftSide = ball.x - ball.radius;
                    ballRightSide = ball.x + ball.radius;
                }
            
            // otherwise check if the ball hit the RIGHT side of the block
            } else if (ballLeftSide < blockRightSide && ballGoingLeft) {
                
                // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                if (ball.y > blockTopSide && ball.y < blockBottomSide) {
                    // change horizontal direction
                    ball.speedX = -ball.speedX;
                    ballGoingLeft = false;
                    ballGoingRight = true;
                    
                    // put the ball at the collision point
                    ball.x = blockRightSide + ball.radius;

                    // update the horizontal ball bounds
                    ballRightSide = ball.x + ball.radius;
                    ballLeftSide = ball.x - ball.radius;
                }
            }
            
            // check if the ball hit the TOP side of the block
            if (ballBottomSide > blockTopSide && ballGoingDown) {

                // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                if (ball.x > blockLeftSide && ball.x < blockRightSide) {
                    // change vertical direction
                    ball.speedY = -ball.speedY;
                    ballGoingDown = false;
                    ballGoingUp = true;
                    
                    // put the ball at the collision point
                    ball.y = blockTopSide - ball.radius;

                    // update the vertical ball bounds
                    ballTopSide = ball.y - ball.radius;
                    ballBottomSide = ball.y + ball.radius;
                }
            
            // otherwise check if the ball hit the BOTTOM side of the block
            } else if (ballTopSide < blockBottomSide && ballGoingUp) {

                // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                if (ball.x > blockLeftSide && ball.x < blockRightSide) {
                    // change vertical direction
                    ball.speedY = -ball.speedY;
                    ballGoingUp = false;
                    ballGoingDown = true;
                    
                    // put the ball at the collision point
                    ball.y = blockBottomSide + ball.radius;

                    // update the vertical ball bounds
                    ballBottomSide = ball.y + ball.radius;
                    ballTopSide = ball.y - ball.radius;
                }
            }

            decreaseBlockHealth(block);

            if (block.health > 0) {
                // update color of breakable block based on health
                block.color = game.blockInit.breakableBlockColor[block.health-1];
            } else {
                clearBlock(block, index);
            }

            incrementScore(block);
            playSound(game.audio.blockCollisionSound);
        }
    });
}

function testCollisionBallWithInnerWalls(ball) {
    if(circRectsOverlap(game.wall.x, game.wall.y, game.wall.width, game.wall.height, ball.x, ball.y, ball.radius)) {
        let ballRightSide = ball.x + ball.radius;
        let ballLeftSide = ball.x - ball.radius;
        let wallRightSide = game.wall.x + game.wall.width;
        let wallLeftSide = game.wall.x;

        let ballTopSide = ball.y - ball.radius;
        let ballBottomSide = ball.y + ball.radius;
        let wallTopSide = game.wall.y;
        let wallBottomSide = game.wall.y + game.wall.height;

        let ballGoingRight = ball.speedX > 0;
        let ballGoingLeft = ball.speedX < 0;
        let ballGoingUp = ball.speedY < 0;
        let ballGoingDown = ball.speedY > 0;

        // check if the ball hit the LEFT side of the wall
        if (ballRightSide > wallLeftSide && ballGoingRight) {
            
            // also check if the ball centre is within the TOP & BOTTOM bounds of the wall
            if (ball.y > wallTopSide && ball.y < wallBottomSide) {
                // change horizontal direction
                ball.speedX = -ball.speedX;
                ballGoingRight = false;
                ballGoingLeft = true;
                
                // put the ball at the collision point
                ball.x = ballLeftSide - ball.radius;
                
                // update the horizontal ball bounds
                ballLeftSide = ball.x - ball.radius;
                ballRightSide = ball.x + ball.radius;
            }
        
        // otherwise check if the ball hit the RIGHT side of the wall
        } else if (ballLeftSide < wallRightSide && ballGoingLeft) {
            
            // also check if the ball centre is within the TOP & BOTTOM bounds of the wall
            if (ball.y > wallTopSide && ball.y < wallBottomSide) {
                // change horizontal direction
                ball.speedX = -ball.speedX;
                ballGoingLeft = false;
                ballGoingRight = true;
                
                // put the ball at the collision point
                ball.x = wallRightSide + ball.radius;

                // update the horizontal ball bounds
                ballRightSide = ball.x + ball.radius;
                ballLeftSide = ball.x - ball.radius;
            }
        }
        
        // check if the ball hit the TOP side of the wall
        if (ballBottomSide > wallTopSide && ballGoingDown) {

            // also check if the ball centre is within the LEFT & RIGHT bounds of the wall
            if (ball.x > wallLeftSide && ball.x < wallRightSide) {
                // change vertical direction
                ball.speedY = -ball.speedY;
                ballGoingDown = false;
                ballGoingUp = true;
                
                // put the ball at the collision point
                ball.y = wallTopSide - ball.radius;

                // update the vertical ball bounds
                ballTopSide = ball.y - ball.radius;
                ballBottomSide = ball.y + ball.radius;
            }
        
        // otherwise check if the ball hit the BOTTOM side of the wall
        } else if (ballTopSide < wallBottomSide && ballGoingUp) {

            // also check if the ball centre is within the LEFT & RIGHT bounds of the wall
            if (ball.x > wallLeftSide && ball.x < wallRightSide) {
                // change vertical direction
                ball.speedY = -ball.speedY;
                ballGoingUp = false;
                ballGoingDown = true;
                
                // put the ball at the collision point
                ball.y = wallBottomSide + ball.radius;

                // update the vertical ball bounds
                ballBottomSide = ball.y + ball.radius;
                ballTopSide = ball.y - ball.radius;
            }
        }
    }
}

function testCollisionPickupWithFloor(pickup, index) {
    if ((pickup.y + pickup.radius) > game.canvas.h) {
        despawnPickup(index);
    }
}

function testCollisionPickupWithPlayer(pickup, index) {
    if(circRectsOverlap(game.player.x, game.player.y, game.player.width, game.player.height, pickup.x, pickup.y, pickup.radius)) {
        let pickupRightSide = pickup.x + pickup.radius;
        let pickupLeftSide = pickup.x - pickup.radius;
        let playerRightSide = game.player.x + game.player.width;
        let playerLeftSide = game.player.x;

        let pickupTopSide = pickup.y - pickup.radius;
        let pickupBottomSide = pickup.y + pickup.radius;
        let playerTopSide = game.player.y;
        let playerBottomSide = game.player.y + game.player.height;

        if (((pickupRightSide > playerLeftSide || pickupLeftSide < playerRightSide) &&
            (pickup.y > playerTopSide && pickup.y < playerBottomSide)) ||
            ((pickupBottomSide > playerTopSide || pickupTopSide < playerBottomSide) &&
            (pickup.x > playerLeftSide && pickup.x < playerRightSide))) {
            
            let size = 'size';
            let life = 'life';
            let laser = 'laser';
            let points = 'points';
            
            if (pickup.type === size) {
                growPlayer();
            } else if (pickup.type === life) {
                increasePlayerLives();
            } else if (pickup.type === laser) {
                equipLaser(laser);
            } else if (pickup.type === points) {
                game.gameState.currentScore += 10;
            }
            
            despawnPickup(index);
        }

        playSound(game.audio.pickupCollisionSound);
    }
}

function testCollisionProjectileWithBlocks(projectile) {
    game.blocks.forEach(function(block, index) {
        if (rectsOverlap(block.x, block.y, block.width, block.height, projectile.x, projectile.y, projectile.width, projectile.height)) {
            clearBlock(block, index);
            despawnProjectile(projectile);
            incrementScore(block);
            playSound(game.audio.laserProjectileExplosionSound);
        }
    });
}

function testCollisionProjectileWithWalls(projectile) {
    let projectileTop = projectile.y;
    let topBoundary = 0;
    if (projectileTop < topBoundary) {
        despawnProjectile(projectile);
    }
}