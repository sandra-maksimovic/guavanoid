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
        button.color = 'rgb(130, 199, 51)';
        button.textColor = 'white';
        button.draw(game.canvas.ctx);
        game.handler.buttonIsHovering = true;

    } else if (!isInsideButton && game.handler.buttonIsHovering) {
        button.color = 'white';
        button.textColor = 'black';
        button.draw(game.canvas.ctx);
        game.handler.buttonIsHovering = false;

    }
}

function changeToggleButtonColor(button, color) {
    button.color = color;
    button.draw(game.canvas.ctx);
}

function checkToggleBtnHover(button, isInsideButton) {
    if (isInsideButton && !button.isHovering) {
        changeToggleButtonColor(button, game.iconInit.hoverColor);
        button.isHovering = true;
    } else if (!isInsideButton && button.isHovering) {
        changeToggleButtonColor(button, game.iconInit.color);
        button.isHovering = false;
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
 
    checkToggleBtnHover(game.button.sfxToggleBtn, isInsideSFXButton);
    checkToggleBtnHover(game.button.legendToggleBtn, isInsideLegendButton);
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
        game.blocks.splice(0, game.blocks.length);
    }
    if (evt.key === "Escape" && game.gameState.loaded) {
        if (game.gameState.paused === false) {
            game.gameState.paused = true;
            game.htmlElements.pauseDiv.classList.remove("hidden");
        } else {
            game.gameState.paused = false;
            game.htmlElements.pauseDiv.classList.add("hidden");
        }
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