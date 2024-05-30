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

function testCollisionBallWithPlayer(b, audio, player, ballInit) {
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
                let fullSpeedX = ballInit.ballStartSpeedX;
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

function testCollisionBallWithBlocks(b, audio, blocks, breakableBlockColor, gameState, spawn) {
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

            block.health -= 1;

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

            if (block.health > 0) {
                // update the color of breakable block with health left
                block.color = breakableBlockColor[block.health-1];
            } else {
                if (block.hasPickup === true) {
                    spawnPickup(block, spawn);
                }

                // remove the block from the array
                blocks.splice(index, 1);
            }

            incrementScore(block, gameState);
        }
    });
}

function testCollisionBallWithInnerWalls(b, wall) {
    if(circRectsOverlap(wall.x, wall.y, wall.width, wall.height, b.x, b.y, b.radius)) {
        let ballRightSide = b.x + b.radius;
        let ballLeftSide = b.x - b.radius;
        let wallRightSide = wall.x + wall.width;
        let wallLeftSide = wall.x;

        let ballTopSide = b.y - b.radius;
        let ballBottomSide = b.y + b.radius;
        let wallTopSide = wall.y;
        let wallBottomSide = wall.y + wall.height;

        let ballGoingRight = b.speedX > 0;
        let ballGoingLeft = b.speedX < 0;
        let ballGoingUp = b.speedY < 0;
        let ballGoingDown = b.speedY > 0;

        // check if the ball hit the LEFT side of the wall
        if (ballRightSide > wallLeftSide && ballGoingRight) {
            
            // also check if the ball centre is within the TOP & BOTTOM bounds of the wall
            if (b.y > wallTopSide && b.y < wallBottomSide) {
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
        
        // otherwise check if the ball hit the RIGHT side of the wall
        } else if (ballLeftSide < wallRightSide && ballGoingLeft) {
            
            // also check if the ball centre is within the TOP & BOTTOM bounds of the wall
            if (b.y > wallTopSide && b.y < wallBottomSide) {
                // change horizontal direction
                b.speedX = -b.speedX;
                ballGoingLeft = false;
                ballGoingRight = true;
                
                // put the ball at the collision point
                b.x = wallRightSide + b.radius;

                // update the horizontal ball bounds
                ballRightSide = b.x + b.radius;
                ballLeftSide = b.x - b.radius;
            }
        }
        
        // check if the ball hit the TOP side of the wall
        if (ballBottomSide > wallTopSide && ballGoingDown) {

            // also check if the ball centre is within the LEFT & RIGHT bounds of the wall
            if (b.x > wallLeftSide && b.x < wallRightSide) {
                // change vertical direction
                b.speedY = -b.speedY;
                ballGoingDown = false;
                ballGoingUp = true;
                
                // put the ball at the collision point
                b.y = wallTopSide - b.radius;

                // update the vertical ball bounds
                ballTopSide = b.y - b.radius;
                ballBottomSide = b.y + b.radius;
            }
        
        // otherwise check if the ball hit the BOTTOM side of the wall
        } else if (ballTopSide < wallBottomSide && ballGoingUp) {

            // also check if the ball centre is within the LEFT & RIGHT bounds of the wall
            if (b.x > wallLeftSide && b.x < wallRightSide) {
                // change vertical direction
                b.speedY = -b.speedY;
                ballGoingUp = false;
                ballGoingDown = true;
                
                // put the ball at the collision point
                b.y = wallBottomSide + b.radius;

                // update the vertical ball bounds
                ballBottomSide = b.y + b.radius;
                ballTopSide = b.y - b.radius;
            }
        }
    }
}

function testCollisionPickupWithFloor(p, spawn, index, canvas) {
    if ((p.y + p.radius) > canvas.h) {
        spawn.pickupArray.splice(index, 1);
    }
}

function testCollisionPickupWithPlayer(p, spawn, index, audio, handler, player, playerInit, gameState, gameCanvas) {
    if(circRectsOverlap(player.x, player.y, player.width, player.height, p.x, p.y, p.radius)) {
        let pickupRightSide = p.x + p.radius;
        let pickupLeftSide = p.x - p.radius;
        let playerRightSide = player.x + player.width;
        let playerLeftSide = player.x;

        let pickupTopSide = p.y - p.radius;
        let pickupBottomSide = p.y + p.radius;
        let playerTopSide = player.y;
        let playerBottomSide = player.y + player.height;

        if (audio.sfx) { audio.pickupCollisionSound.play(); }

        if (((pickupRightSide > playerLeftSide || pickupLeftSide < playerRightSide) &&
            (p.y > playerTopSide && p.y < playerBottomSide)) ||
            ((pickupBottomSide > playerTopSide || pickupTopSide < playerBottomSide) &&
            (p.x > playerLeftSide && p.x < playerRightSide))) {
            
            let growth = 'growth';
            let health = 'health';
            let laser = 'laser';
            let points = 'points';
            
            if (p.type === growth) {
                growPlayer(player, playerInit, gameState);
            } else if (p.type === health) {
                increaseHealth(player);
            } else if (p.type === laser) {
                equipLaser(gameCanvas, audio, handler, player, spawn, laser);
            } else if (p.type === points) {
                gameState.currentScore += 10;
            }
            
            spawn.pickupArray.splice(index, 1);
        }
    }
}

function testCollisionProjectileWithBlocks(p, audio, blocks, gameState, spawn) {
    blocks.forEach(function(block, index) {
        if (rectsOverlap(block.x, block.y, block.width, block.height,
            p.x, p.y, p.width, p.height)) {
            
            if (audio.sfx) { audio.laserProjectileExplosionSound.play(); }

            // remove the projectile from the projectile array
            let pIndex = spawn.projectileArray.indexOf(p);
            spawn.projectileArray.splice(pIndex, 1);
            
            // remove the block from the block array
            blocks.splice(index, 1);

            incrementScore(block, gameState);
        }
    });
}

function testCollisionProjectileWithWalls(p, spawn) {
    // check if the projectile has hit the top canvas boundary
    if (p.y < 0) {
        // remove the projectile from the projectile array
        let pIndex = spawn.projectileArray.indexOf(p);
        spawn.projectileArray.splice(pIndex, 1);
    }
}