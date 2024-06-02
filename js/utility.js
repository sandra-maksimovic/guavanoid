// for time based animation
var delta, then;

function calcIncrement(speed, del) {
    return (speed*del) / 1000;
}

function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    let testX=cx;
    let testY=cy;
    if (testX < x0) testX=x0; // test left
    if (testX > (x0+w0)) testX=(x0+w0); // test right
    if (testY < y0) testY=y0; // test top
    if (testY > (y0+h0)) testY=(y0+h0); // test bottom
    return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY)) < r*r); // to avoid expensive sqrt calc
}

function equipLaser(laser) {
    // get the associated pickup type color from the pickupTypeArray of objects
    let index = game.spawn.pickupTypeArray.findIndex(obj => obj.type === laser);
    game.player.color = game.spawn.pickupTypeArray[index].color;

    // give the player more projectiles
    game.player.numProjectiles = game.spawn.numProjectiles;

    if (game.player.armed === false) { game.player.armed = true; }
}

function fireProjectile() {
    let projectile = new Projectile();
    let newLength = game.spawn.projectileArray.push(projectile);
    let newIndex = newLength - 1;
    game.spawn.projectileArray[newIndex].x = game.player.x + (game.player.width / 2) - (game.spawn.projectileArray[newIndex].width / 2);
    game.spawn.projectileArray[newIndex].y = game.player.y - game.spawn.projectileArray[newIndex].height;
    if (game.audio.sfx) { game.audio.laserProjectileSound.play(); }
    game.player.numProjectiles--;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function growPlayer() {
    game.player.growthActive = true;
    if (game.player.width !== game.playerInit.playerWidth*2) {
        game.player.width = game.player.width*2;
    }
    game.gameState.pickupGrowthTimerStartTime = performance.now();
}

function increaseHealth(player) {
    player.lives++;
}

function incrementScore(block, gameState) {
    let score;

    switch(block.color) {
        case 'red':
            score = 7;
            break;
        case 'orange':
            score = 6;
            break;
        case 'yellow':
            score = 5;
            break;
        case 'green':
            score = 4;
            break;
        case 'blue':
            score = 3;
            break;
        case 'indigo':
            score = 2;
            break;
        case 'violet':
            score = 1;
            break;
        default:
            score = 1;
            break;
    }

    gameState.currentScore += score;
}

function randomlyAssignPickupsToBlocks(blockArray, spawn) {
    for (let i = 0; i < spawn.numPickups; i++) {
        let randomInt = getRandomInt(0, blockArray.length-1);
        blockArray[randomInt].hasPickup = true;
    }
}

function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    if ((x1 > (x2 + w2)) || ((x1 + w1) < x2)) {
        return false; // No horizontal axis projection overlap
    }

    if ((y1 > (y2 + h2)) || ((y1 + h1) < y2)) {
        return false; // No vertical axis projection overlap
    }

    return true;    // If previous tests failed, then both axis projections
                    // overlap and the rectangles intersect
}

function saveHighScore() {
    if (localStorage.highScore === undefined ||
        localStorage.highScore < game.gameState.totalScore) {
            window.localStorage.highScore = JSON.stringify(game.gameState.totalScore);
        }
}

function spawnPickup(block, spawn) {
    let pickupX = block.x + (block.width / 2);
    let pickupY = block.y + (block.height / 2);
    let pickupRadius = block.height / 2;
    let pickupColor = 'black'; // for init only bc Pickup extends Ball, this gets overridden below by pickup type
    let pickupSpeedX = 200; // px/s - for init only bc Pickup extends Ball, speedX not used for pickups since they only fall
    let pickupSpeedY = 200; // px/s

    let pickup = new Pickup(pickupX, pickupY, pickupRadius, pickupColor, pickupSpeedX, pickupSpeedY);
    let randomInt = getRandomInt(0, spawn.pickupTypeArray.length-1);
    pickup.type = spawn.pickupTypeArray[randomInt].type;
    pickup.color = spawn.pickupTypeArray[randomInt].color;
    spawn.pickupArray.push(pickup);
}