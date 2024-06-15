// ADD LISTENERS
function addListeners() {
    document.addEventListener('keydown', processKeyDown);
    gameCanvas.addEventListener('click', processClick);
    gameCanvas.addEventListener('mousemove', mouseMoved);
}

function addButtonListeners(button) {
    // arrow function ensures the callback is not triggered upon assignment
    game.handler.buttonClickHandler = (evt) => buttonClick(evt, button);
    gameCanvas.addEventListener('click', game.handler.buttonClickHandler);

    // the handler gives us a ref to the parameterised callback which is required for 
    // listener removal since identical inline parameterised callbacks give different refs
    game.handler.buttonHoverHandler = (evt) => buttonHover(evt, button);
    gameCanvas.addEventListener('mousemove', game.handler.buttonHoverHandler);
}

// LISTENER BEHAVIOURS
function buttonClick(evt, button) {
    let rect = gameCanvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    if (x >= button.x && x <= (button.x + button.width) && 
        y >= button.y && y <= (button.y + button.height)) {
            removeButtonListeners();
            game = new Game();
            game.start();
    }
}

function buttonHover(evt, button) {
    let rect = gameCanvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    const isInsideButton = x >= button.x && x <= (button.x + button.width) && 
                           y >= button.y && y <= (button.y + button.height);
    
    // hover state changes should only occur once 
    // when entering and leaving the button area
    if (isInsideButton && !game.handler.buttonIsHovering) {
        button.color = game.textButtonInit.colorHover;
        button.textColor = game.textButtonInit.textColorHover;
        button.draw(game.canvas.ctx);
        game.handler.buttonIsHovering = true;

    } else if (!isInsideButton && game.handler.buttonIsHovering) {
        button.color = game.textButtonInit.color;
        button.textColor = game.textButtonInit.textColor;
        button.draw(game.canvas.ctx);
        game.handler.buttonIsHovering = false;

    }
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
 
    toggleBtnHover(game.button.sfxToggleBtn, isInsideSFXButton);
    toggleBtnHover(game.button.legendToggleBtn, isInsideLegendButton);
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

function removeButtonListeners() {
    gameCanvas.removeEventListener('click', game.handler.buttonClickHandler);
    gameCanvas.removeEventListener('mousemove', game.handler.buttonHoverHandler);
}