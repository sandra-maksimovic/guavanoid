// ADD LISTENERS
function addListeners() {
    document.addEventListener('keydown', processKeyDown);
    gameCanvas.addEventListener('click', processClick);
    gameCanvas.addEventListener('mousemove', mouseMoved);
}

function addTextButtonListeners(button) {
    // arrow function ensures the callback is not triggered upon assignment
    game.handler.textButtonClick = (evt) => textButtonClick(evt, button);
    gameCanvas.addEventListener('click', game.handler.textButtonClick);

    // the handler gives us a ref to the parameterised callback which is required for 
    // listener removal since identical inline parameterised callbacks give different refs
    game.handler.textButtonHover = (evt) => textButtonHover(evt, button);
    gameCanvas.addEventListener('mousemove', game.handler.textButtonHover);
}

// LISTENER BEHAVIOURS
function textButtonClick(evt, button) {
    let rect = gameCanvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    if (x >= button.x && x <= (button.x + button.width) && 
        y >= button.y && y <= (button.y + button.height)) {
            removeTextButtonListeners();
            game = new Game();
            game.start();
    }
}

function textButtonHover(evt, button) {
    let rect = gameCanvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    const isInsideButton = x >= button.x && x <= (button.x + button.width) && 
                           y >= button.y && y <= (button.y + button.height);
    
    checkBtnHover(button, isInsideButton, game.textButtonInit);
}

function getMousePos(evt) {
    let rect = gameCanvas.getBoundingClientRect();
    
    // we can return the mouse coords as a simple object in JS
    return { 
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }
}

function mouseMoved(evt) {
    game.inputState.mousePos = getMousePos(evt);

    const isInsideSFXButton = game.inputState.mousePos.x < (game.button.sfxToggleBtn.x + game.button.sfxToggleBtn.width) &&
                              game.inputState.mousePos.y > (game.button.sfxToggleBtn.y);
    
    const isInsideLegendButton = game.inputState.mousePos.x > (game.button.legendToggleBtn.x) &&
                                 game.inputState.mousePos.y > (game.button.legendToggleBtn.y);
 
    checkBtnHover(game.button.sfxToggleBtn, isInsideSFXButton, game.iconInit);
    checkBtnHover(game.button.legendToggleBtn, isInsideLegendButton, game.iconInit);
}

function processClick(evt) {
    let rect = gameCanvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    const isInsideSFXButton = x < (game.button.sfxToggleBtn.x + game.button.sfxToggleBtn.width) &&
                              y > (game.button.sfxToggleBtn.y);
    
    const isInsideLegendButton = x > (game.button.legendToggleBtn.x) &&
                                 y > (game.button.legendToggleBtn.y);

    if (isInsideSFXButton && game.gameState.loaded) {
        toggleSFX();
    } else if (isInsideLegendButton && game.gameState.loaded) {
        toggleOverlay();
    } else if (game.ball.isAttached && game.gameState.loaded) {
        detachBall();
    } else if (game.player.armed) {
        spawnProjectile();
    }
}

function processKeyDown(evt) {
    if (evt.key === "b" && !game.gameState.paused) {
        clearAllBlocks(); // for testing only -- to be removed
    }
    if (evt.key === "Escape" && game.gameState.loaded) {
        togglePause();
    }
}

// REMOVE LISTENERS
function removeListeners() {
    document.removeEventListener('keydown', processKeyDown);
    gameCanvas.removeEventListener('click', processClick);
    gameCanvas.removeEventListener('mousemove', mouseMoved);
}

function removeTextButtonListeners() {
    gameCanvas.removeEventListener('click', game.handler.textButtonClick);
    gameCanvas.removeEventListener('mousemove', game.handler.textButtonHover);
}