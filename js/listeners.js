let processClickHandler, processKeyDownHandler, mouseMovedHandler, clearBlocksHandler;

function addMouseListeners(canvas, ball, inputState) {
    // add a mousemove event listener to the canvas to track user mouse movement
    // arrow function ensures the function is not triggered upon assigning it as an event listener
    mouseMovedHandler = (evt) => mouseMoved(evt, canvas, inputState);
    canvas.addEventListener('mousemove', mouseMovedHandler);

    // add a mouseclick event listener to the canvas to move the ball
    processClickHandler = (evt) => processClick(evt, ball);
    canvas.addEventListener('click', processClickHandler);
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

function processClick(evt, ball) {
    ball.isAttached = false;
}

function removeMouseListeners(canvas) {
    canvas.removeEventListener('mousemove', mouseMovedHandler);
    canvas.removeEventListener('click', processClickHandler);
}

function addPauseListener(gameState, htmlElements) {
    // add a keydown event listener to the window to pause the game
    processKeyDownHandler = (evt) => processKeyDown(evt, gameState, htmlElements);
    document.addEventListener('keydown', processKeyDownHandler);
}

function processKeyDown(evt, gameState, htmlElements) {
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
    document.removeEventListener('keydown', processKeyDownHandler);
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