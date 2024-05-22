let detachBallHandler, pauseGameHandler, mouseMovedHandler, clearBlocksHandler, fireProjectileHandler;

function addMouseListeners(canvas, ball, inputState) {
    // add a mousemove event listener to the canvas to track user mouse movement
    // arrow function ensures the function is not triggered upon assigning it as an event listener
    mouseMovedHandler = (evt) => mouseMoved(evt, canvas, inputState);
    canvas.addEventListener('mousemove', mouseMovedHandler);

    // add a mouseclick event listener to the canvas to move the ball
    detachBallHandler = (evt) => detachBall(evt, ball);
    canvas.addEventListener('click', detachBallHandler);
}

// called when the user moves the mouse
function mouseMoved(evt, canvas, inputState) {
    inputState.mousePos = getMousePos(evt, canvas);
}

function getMousePos(evt, canvas) {
    // necessary to work in the local canvas coordinate system
    let rect = canvas.getBoundingClientRect();
    
    // we can return the mouse coords as a simple object in JS
    return { x: evt.clientX - rect.left }
}

function detachBall(evt, ball) {
    ball.isAttached = false;
}

function removeMouseListeners(canvas) {
    canvas.removeEventListener('mousemove', mouseMovedHandler);
    canvas.removeEventListener('click', detachBallHandler);
}

function addPauseListener(gameState, htmlElements) {
    // add a keydown event listener to the window to pause the game
    pauseGameHandler = (evt) => pauseGame(evt, gameState, htmlElements);
    document.addEventListener('keydown', pauseGameHandler);
}

function pauseGame(evt, gameState, htmlElements) {
    if (!game.checkWinCondition() && !game.checkLoseCondition()) {
        if (evt.key === "Escape") {
            if (gameState.paused === false) {
                gameState.paused = true;
                htmlElements.pauseDiv.classList.remove("hidden");
            } else {
                gameState.paused = false;
                htmlElements.pauseDiv.classList.add("hidden");
            }
        }
    }
}

function removePauseListener() {
    document.removeEventListener('keydown', pauseGameHandler);
}

function addProjectileListener(canvas, audio, player, spawn) {
    fireProjectileHandler = (evt) => fireProjectile(evt, audio, player, spawn);
    canvas.addEventListener('click', fireProjectileHandler);
}

function fireProjectile(evt, audio, player, spawn) {
    let projectile = new Projectile();
    let newLength = spawn.projectileArray.push(projectile);
    let newIndex = newLength - 1;
    spawn.projectileArray[newIndex].x = player.x + (player.width / 2) - (spawn.projectileArray[newIndex].width / 2);
    spawn.projectileArray[newIndex].y = player.y - spawn.projectileArray[newIndex].height;
    if (audio.sfx) { audio.laserProjectileSound.play(); }
    player.numProjectiles--;
}

function removeProjectileListener(canvas) {
    canvas.removeEventListener('click', fireProjectileHandler);
}

function addTestListener(blocks) {
    clearBlocksHandler = (evt) => clearBlocks(evt, blocks);
    document.addEventListener('keydown', clearBlocksHandler);
}

// removes all blocks from a level
function clearBlocks(evt, blocks) {
    if (evt.key === "b") {
        blocks.splice(0, blocks.length);
    }
}

function removeTestListener() {
    document.removeEventListener('keydown', clearBlocksHandler);
}