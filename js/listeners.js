let detachBallHandler, pauseGameHandler, mouseMovedHandler, clearBlocksHandler, fireProjectileHandler;

// ADD LISTENERS
function addMouseListeners(canvas, ball, inputState) {
    // arrow function ensures the function is not triggered upon assigning it as an event listener
    mouseMovedHandler = (evt) => mouseMoved(evt, canvas, inputState);
    canvas.addEventListener('mousemove', mouseMovedHandler);

    detachBallHandler = (evt) => detachBall(evt, ball);
    canvas.addEventListener('click', detachBallHandler);
}

function addPauseListener(gameState, htmlElements) {
    pauseGameHandler = (evt) => pauseGame(evt, gameState, htmlElements);
    document.addEventListener('keydown', pauseGameHandler);
}

function addProjectileListener(canvas, audio, player, spawn) {
    fireProjectileHandler = (evt) => fireProjectile(evt, audio, player, spawn);
    canvas.addEventListener('click', fireProjectileHandler);
}

function addTestListener(blocks) {
    clearBlocksHandler = (evt) => clearBlocks(evt, blocks);
    document.addEventListener('keydown', clearBlocksHandler);
}

// LISTENER BEHAVIOURS
function clearBlocks(evt, blocks) {
    if (evt.key === "b") {
        blocks.splice(0, blocks.length);
    }
}

function detachBall(evt, ball) {
    ball.isAttached = false;
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

function getMousePos(evt, canvas) {
    // necessary to work in the local canvas coordinate system
    let rect = canvas.getBoundingClientRect();
    
    // we can return the mouse coords as a simple object in JS
    return { x: evt.clientX - rect.left }
}

function mouseMoved(evt, canvas, inputState) {
    inputState.mousePos = getMousePos(evt, canvas);
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

// REMOVE LISTENERS
function removeMouseListeners(canvas) {
    canvas.removeEventListener('mousemove', mouseMovedHandler);
    canvas.removeEventListener('click', detachBallHandler);
}

function removePauseListener() {
    document.removeEventListener('keydown', pauseGameHandler);
}

function removeProjectileListener(canvas) {
    canvas.removeEventListener('click', fireProjectileHandler);
}

function removeTestListener() {
    document.removeEventListener('keydown', clearBlocksHandler);
}