// for time based animation
var delta, then;

function calcIncrement(speed, del) {
    return (speed*del) / 1000;
}

// test whether rectangle and circle overlap
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    let testX=cx;
    let testY=cy;
    if (testX < x0) testX=x0; // test left
    if (testX > (x0+w0)) testX=(x0+w0); // test right
    if (testY < y0) testY=y0; // test top
    if (testY > (y0+h0)) testY=(y0+h0); // test bottom
    return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY)) < r*r); // to avoid expensive sqrt calc
}

function randomlyAssignPickupsToBlocks(blockArray, spawn) {
    for (let i = 0; i < spawn.numPickups; i++) {
        let randomInt = getRandomInt(0, blockArray.length-1);
        blockArray[randomInt].hasPickup = true;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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