function addListeners(canvas, ball, blocks, inputState, gameState, htmlElement) {
    // add a mousemove event listener to the canvas to track user mouse movement
    // arrow function ensures the function is not triggered upon assigning it as an event listener
    canvas.addEventListener('mousemove', (evt) => mouseMoved(evt, canvas, inputState));

    // add a mouseclick event listener to the canvas to move the ball
    canvas.addEventListener('click', (evt) => processClick(evt, ball));

    // add a keydown event listener to the window to pause the game
    document.addEventListener('keydown', (evt) => processKeyDown(evt, gameState, htmlElement));

    // for testing
    //document.addEventListener('keydown', (evt) => clearBlocks(evt, blocks));
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

function processKeyDown(evt, gameState, htmlElement) {
    if (!game.checkWinCondition() && !game.checkLoseCondition()) {
        if (evt.key === "Escape") {
            if (gameState.paused === false) {
                gameState.paused = true;
                htmlElement.pauseDiv.classList.remove("hidden");
            } else {
                gameState.paused = false;
                htmlElement.pauseDiv.classList.add("hidden");
            }
        }
    }
}

// for testing
/*function clearBlocks(evt, blocks) {
    if (evt.key === "b") {
        blocks.splice(0, blocks.length);
    }
}*/