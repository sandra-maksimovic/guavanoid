// ADD LISTENERS
function addMouseListeners(canvas, ball, button, ctx, handler, icon, inputState) {
    // arrow function ensures the function is not triggered upon assigning it as an event listener
    handler.mouseMovedHandler = (evt) => mouseMoved(evt, button, canvas, ctx, inputState);
    canvas.addEventListener('mousemove', handler.mouseMovedHandler);

    canvas.addEventListener('click', processClick);
}

function addPauseListener(gameState, handler, htmlElements) {
    handler.pauseGameHandler = (evt) => pauseGame(evt, gameState, htmlElements);
    document.addEventListener('keydown', handler.pauseGameHandler);
}

function addButtonListeners(canvas, ctx, handler, button) {
    handler.buttonClickHandler = (evt) => buttonClick(evt, canvas, handler, button);
    canvas.addEventListener('click', handler.buttonClickHandler);

    handler.buttonHoverHandler = (evt) => buttonHover(evt, canvas, ctx, handler, button);
    canvas.addEventListener('mousemove', handler.buttonHoverHandler);
}

function addTestListener(blocks, handler) {
    handler.clearBlocksHandler = (evt) => clearBlocks(evt, blocks);
    document.addEventListener('keydown', handler.clearBlocksHandler);
}

// LISTENER BEHAVIOURS
function clearBlocks(evt, blocks) {
    if (evt.key === "b") {
        blocks.splice(0, blocks.length);
    }
}

function processClick(evt) {
    let rect = gameCanvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    const isInsideSFXButton = x < (game.button.sfxToggleBtn.x + game.button.sfxToggleBtn.width) &&
                              y > (game.button.sfxToggleBtn.y)

    if (isInsideSFXButton) {
        game.toggleSFX();

        if (game.audio.sfx) { game.button.sfxToggleBtn.img = game.icon.sfxOn; }
        else                { game.button.sfxToggleBtn.img = game.icon.sfxOff; }
        game.button.sfxToggleBtn.draw(game.canvas.ctx);
    
    } else if (game.ball.isAttached) {
        game.ball.isAttached = false;

    } else if (game.player.armed) {
        fireProjectile();
    }
}

function getMousePos(evt, button, canvas, ctx) {
    let rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    const isInsideSFXButton = x < (button.sfxToggleBtn.x + button.sfxToggleBtn.width) &&
                              y > (button.sfxToggleBtn.y)
    
    if (isInsideSFXButton && !button.isHovering) {
        button.sfxToggleBtn.color = 'lightgray';
        button.sfxToggleBtn.draw(ctx);
        button.isHovering = true;
    } else if (!isInsideSFXButton && button.isHovering) {
        button.sfxToggleBtn.color = 'gray';
        button.sfxToggleBtn.draw(ctx);
        button.isHovering = false;
    }

    // we can return the mouse coords as a simple object in JS
    return { x: evt.clientX - rect.left }
}

function mouseMoved(evt, button, canvas, ctx, inputState) {
    inputState.mousePos = getMousePos(evt, button, canvas, ctx);
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

function buttonClick(evt, canvas, handler, button) {
    let rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    if (x >= button.x && x <= (button.x + button.width) && 
        y >= button.y && y <= (button.y + button.height)) {
            
            // reset button listeners
            removeButtonListeners(gameCanvas, handler);

            // start or restart the game
            game = new Game();
            game.start();
    }
}

function buttonHover(evt, canvas, ctx, handler, button) {
    let rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    const isInsideButton = x >= button.x && x <= (button.x + button.width) && 
                           y >= button.y && y <= (button.y + button.height);
    
    // hover state changes should only occur once 
    // when entering and leaving the button area
    if (isInsideButton && !handler.buttonIsHovering) {
        button.color = 'blue';
        button.textColor = 'white';
        button.draw(ctx);
        handler.buttonIsHovering = true;

    } else if (!isInsideButton && handler.buttonIsHovering) {
        button.color = 'white';
        button.textColor = 'black';
        button.draw(ctx);
        handler.buttonIsHovering = false;

    }
}

// REMOVE LISTENERS
function removeMouseListeners(canvas, handler) {
    canvas.removeEventListener('mousemove', handler.mouseMovedHandler);
    canvas.removeEventListener('click', handler.processClickHandler);
}

function removePauseListener(handler) {
    document.removeEventListener('keydown', handler.pauseGameHandler);
}

function removeButtonListeners(canvas, handler) {
    canvas.removeEventListener('click', handler.buttonClickHandler);
    canvas.removeEventListener('mousemove', handler.buttonHoverHandler);
}

function removeTestListener(handler) {
    document.removeEventListener('keydown', handler.clearBlocksHandler);
}