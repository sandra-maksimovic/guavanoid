"use strict";

var game, gameCanvas;
var isGlobalSFX = true;

var Game = function() {    
    let canvas = {
        ctx: gameCanvas.getContext("2d"),
        h: gameCanvas.height,
        w: gameCanvas.width
    };

    let audio = {
        blockCollisionSound: undefined,
        failCollisionSound: undefined,
        laserProjectileSound: undefined,
        laserProjectileExplosionSound: undefined,
        pickupCollisionSound: undefined,
        playerCollisionSound: undefined,
        isSFX: true
    };

    let ball;

    let ballInit = {
        ballColor: 'lime',
        ballRadius: 5,
        ballStartPosX: canvas.w / 2,
        ballStartPosY: undefined, // set later in start(), requires ballInit.ballRadius value for init
        ballStartSpeedX: 300, // 60 fps * 5 px = 300 px/s
        ballStartSpeedY: -300 // 60 fps * 5 px = 300 px/s
    };

    let blocks = [];

    let blockInit = {
        blockArray: [],
        blockColor: [
            'red',
            'orange',
            'yellow',
            'green',
            'blue',
            'indigo',
            'violet'
        ],
        blockGap: 3,
        blockHeight: 20,
        blockWidth: 60,
        breakableBlockColor: [
            'white',
            'darkgray',
            'dimgray'
        ]
    };

    let button = {
        //isHovering: false,
        legendToggleBtn: undefined,
        sfxToggleBtn: undefined
    };

    let gameState = {
        currentLevel: 1,
        currentScore: 0,
        displayTitle: true,
        displayTitleTimer: 1500, //ms
        displayTitleTimerStartTime: 0,
        hasWall: false,
        loaded: false,
        paused: false,
        pickupGrowthTimer: 10000, //ms
        pickupGrowthTimerStartTime: 0,
        totalLevels: 5,
        totalScore: 0
    };

    let handler = {
        buttonClickHandler: undefined,
        buttonHoverHandler: undefined,
        buttonIsHovering: false,
    };

    let htmlElements = {
        pauseDiv: document.querySelector("#pauseDiv")
    };

    let icon = {
        legendOff: undefined,
        legendOn: undefined,
        sfxOff: undefined,
        sfxOn: undefined
    };

    let iconInit = {
        color: 'gray',
        hoverColor: 'lightgray',
        size: 24
    };

    let inputState = {
        mousePos: {
            x: undefined,
            y: undefined
        }
    };

    let overlay;

    let overlayInit = {
        color: 'rgba(255, 255, 255, 0.5)', // white at 50% opacity
        height: 200,
        width: 300,
        x: canvas.w / 2,
        y: canvas.h / 2
    };

    let pickupInit = {
        numPickups: 3,
        pickupTypeArray: [
            { type: 'growth', color: 'blue' },
            { type: 'health', color: 'green' },
            { type: 'laser', color: 'red' },
            { type: 'points', color: 'yellow' }
        ],
        radius: blockInit.blockHeight / 2,
        speedY: 200, // px/s
    };

    let player;

    let playerInit = {
        playerColor: 'white',
        playerLives: 3,
        playerProjectiles: 0,
        playerHeight: 10,
        playerWidth: 50,
        playerStartPosX: undefined, // set later in start(), requires playerInit.playerWidth value for init
        playerStartPosY: canvas.h - 50
    };

    let projectileInit = {
        numProjectiles: 3
    };

    let spawn = {
        activePickupArray: [],
        activeProjectileArray: []
    };

    let wall;

    let wallInit = {
        wallColor: 'black',
        wallHeight: canvas.h / 2,
        wallWidth: 10,
        wallStrokeColor: 'white',
        wallX: undefined, // set later in start(), requires wallInit.wallWidth value for init
        wallY: 50
    };
    
    var start = function() {
        // reset game state
        audio.isSFX = isGlobalSFX;
        gameState.currentScore = 0;
        gameState.hasWall = false;
        spawn.activePickupArray = [];
        spawn.activeProjectileArray = [];

        // create player
        playerInit.playerStartPosX = (canvas.w / 2) - (playerInit.playerWidth / 2);
        player = new Player(playerInit.playerStartPosX, playerInit.playerStartPosY, playerInit.playerWidth, playerInit.playerHeight, playerInit.playerColor, playerInit.playerLives, playerInit.playerProjectiles);

        // create ball
        ballInit.ballStartPosY = playerInit.playerStartPosY - ballInit.ballRadius;
        ball = new Ball(ballInit.ballStartPosX, ballInit.ballStartPosY, ballInit.ballRadius, ballInit.ballColor, ballInit.ballStartSpeedX, ballInit.ballStartSpeedY);

        // flag which levels have walls
        if (gameState.currentLevel === 3 || gameState.currentLevel === 5) { gameState.hasWall = true; }

        // create vertical wall
        if (gameState.hasWall === true) {
            wallInit.wallX = (canvas.w / 2) - (wallInit.wallWidth / 2);
            wall = new Wall(wallInit.wallX, wallInit.wallY, wallInit.wallWidth, wallInit.wallHeight, wallInit.wallColor, wallInit.wallStrokeColor);
        }

        // create blocks
        blocks = createBlocks();

        overlay = new Overlay(overlayInit.x, overlayInit.y, overlayInit.width, overlayInit.height, overlayInit.color);

        addListeners();

        // load assets, then when this is done, start the mainLoop
        loadAssets(function() {
            // we enter here only when all assets have been loaded
            gameState.displayTitle = true;
            gameState.displayTitleTimerStartTime = performance.now();

            let toggleBtnGap = 3;
            let toggleBtnArea = iconInit.size + toggleBtnGap;
            let legendToggleBtnX = canvas.w - toggleBtnArea;
            let legendToggleBtnY = canvas.h - toggleBtnArea;
            let sfxToggleBtnX = toggleBtnGap;
            let sfxToggleBtnY = canvas.h - toggleBtnArea;

            // create legend & sfx toggle buttons once button image assets have loaded
            button.legendToggleBtn = new ImageButton(legendToggleBtnX, legendToggleBtnY, iconInit.size, iconInit.size, iconInit.color, icon.legendOff);

            if (audio.isSFX) {
                button.sfxToggleBtn = new ImageButton(sfxToggleBtnX, sfxToggleBtnY, iconInit.size, iconInit.size, iconInit.color, icon.sfxOn);
            } else {
                button.sfxToggleBtn = new ImageButton(sfxToggleBtnX, sfxToggleBtnY, iconInit.size, iconInit.size, iconInit.color, icon.sfxOff);
            }

            // start the game
            mainLoop();
        });
    };

    function mainLoop(now) {
        // check whether the title screen has finished
        if (now - gameState.displayTitleTimerStartTime > gameState.displayTitleTimer) {
            gameState.displayTitle = false;
            
            if (!gameState.loaded) { gameState.loaded = true; }

            // main gameplay loop
            if (!gameState.paused) {
                // get the time between frames
                delta = now - then;

                ball.incrementX = calcIncrement(ball.speedX, delta);
                ball.incrementY = calcIncrement(ball.speedY, delta);

                // clear the canvas
                canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);

                button.legendToggleBtn.draw(canvas.ctx);
                button.sfxToggleBtn.draw(canvas.ctx);
                
                // revert player width if growth pickup timer has elapsed
                if ((player.growthActive === true) && 
                    (now - gameState.pickupGrowthTimerStartTime > gameState.pickupGrowthTimer)) {
                        player.width = playerInit.playerWidth;
                        player.growthActive = false;
                }

                // move projectiles if any
                if (spawn.activeProjectileArray.length > 0) {
                    spawn.activeProjectileArray.forEach(projectile => {
                        projectile.draw(canvas.ctx);
                        projectile.incrementY = calcIncrement(projectile.speedY, delta);
                        moveProjectile(projectile);
                    });
                }
                
                // revert player color once projectiles have run out
                if ((player.color !== playerInit.playerColor) && 
                    (player.numProjectiles === 0)) {
                        player.color = playerInit.playerColor;
                        //removeProjectileListener(gameCanvas, handler);
                        player.armed = false;
                        handler.fireProjectileHandler = undefined;
                }

                player.draw(canvas.ctx);

                ball.draw(canvas.ctx);

                if (!ball.isAttached) {
                    moveBall(ball);
                }

                if (gameState.hasWall === true) {
                    wall.draw(canvas.ctx);
                }

                drawAllBlocks(blocks);

                // draw pickups as they spawn
                if (spawn.activePickupArray.length > 0) {
                    spawn.activePickupArray.forEach((pickup, index) => {
                        pickup.draw(canvas.ctx);
                        pickup.incrementY = calcIncrement(pickup.speedY, delta);
                        movePickup(pickup, index);
                    })
                }

                displayHUD();

                if (overlay.isVisible) {
                    overlay.draw(canvas.ctx);
                }

                // make the player follow the mouse
                // test if the mouse is positioned over the canvas first
                if (inputState.mousePos !== undefined) {
                    player.move(inputState.mousePos.x, canvas.w);
                    if (ball.isAttached) {
                        ball.followPlayer(inputState.mousePos.x, player, canvas.w);
                        // make sure the ball always travels upwards on reset
                        ball.speedY = -Math.abs(ball.speedY);
                    }
                }
            }
    
            if (checkLevelCleared()) {
                removeListeners();
                start();

            } else if (checkWinCondition()) {
                removeListeners();
                displayResultScreen('green', 'YOU WIN');

            } else if (checkLoseCondition()) {
                removeListeners();
                displayResultScreen('red', 'YOU LOSE');

            } else {
                // copy the current time to the old time
                then = now;
                // ask for a new animation frame
                requestAnimationFrame(mainLoop);
            }

        // check whether we should display the title screen
        } else if (gameState.displayTitle) {
            displayTitleScreen();
            requestAnimationFrame(mainLoop);
        }
    }

    function createBlocks() {
        if (gameState.currentLevel === 1) {
            blockInit.blockArray = createLevel1Layout();
        } else if (gameState.currentLevel === 2) {
            blockInit.blockArray = createLevel2Layout();
        } else if (gameState.currentLevel === 3) {
            blockInit.blockArray = createLevel3Layout();
        } else if (gameState.currentLevel === 4) {
            blockInit.blockArray = createLevel4Layout();
        } else if (gameState.currentLevel === 5) {
            blockInit.blockArray = createLevel5Layout();
        }

        return blockInit.blockArray;
    }

    function drawAllBlocks(blocks) {
        blocks.forEach(function(block) {
            block.draw(canvas.ctx);
        });
    }

    function displayHUD() {
        const hudXLeftAlign = 40;
        const hudXCenterAlign = canvas.w / 2;
        const huxXRightAlign = canvas.w - 40;
        const hudYTopAlign = 5;

        let level = gameState.currentLevel;
        let score = gameState.totalScore + gameState.currentScore;
        let lives = player.lives;

        canvas.ctx.font = "10px sans-serif";
        canvas.ctx.fillStyle = 'white';
        canvas.ctx.textBaseline = "top";
        canvas.ctx.textAlign = "left";
        canvas.ctx.fillText(`Level: ${level}`, hudXLeftAlign, hudYTopAlign);
        canvas.ctx.textAlign = "center";
        canvas.ctx.fillText(`Score: ${score}`, hudXCenterAlign, hudYTopAlign);
        canvas.ctx.textAlign = "right";
        canvas.ctx.fillText(`Lives: ${lives}`, huxXRightAlign, hudYTopAlign);
    }

    function displayResultScreen(color, text) {
        const midX = canvas.w / 2;
        const midY = canvas.h / 2;

        const resultText = text;
        const resultTextColor = color;
        const resultTextFont = 'bold 100px sans-serif';

        gameState.loaded = false;

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);

        let result = new ResultText(midX, midY, resultTextColor, resultTextFont, resultText);
        result.draw(canvas.ctx);
        
        const buttonColor = 'white';
        const buttonHeight = 50;
        const buttonWidth = 100;
        const buttonText = 'RESTART';
        const buttonTextColor = 'black';
        const buttonX = midX - (buttonWidth / 2);
        const buttonY = midY + (canvas.h-midY) / 2;
        
        let restartButton = new TextButton(buttonX, buttonY, buttonWidth, buttonHeight, buttonColor, buttonText, buttonTextColor);
        restartButton.draw(canvas.ctx);

        addButtonListeners(restartButton);

        if (localStorage.highScore) {
            const highScoreY = midY + (buttonY - midY) / 2;
            const highScoreColor = 'white';
            const highScoreFont = '30px sans-serif';
            const highScoreText = `High Score: ${localStorage.highScore}`;

            let highScore = new ResultText(midX, highScoreY, highScoreColor, highScoreFont, highScoreText);
            highScore.draw(canvas.ctx);
        }
    }

    function displayTitleScreen() {
        const titleX = canvas.w / 2;
        const titleY = canvas.h / 2;

        gameState.loaded = false;

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.font = "bold 100px sans-serif";
        canvas.ctx.fillStyle = 'white';
        canvas.ctx.textAlign = "center";
        canvas.ctx.textBaseline = "middle";
        canvas.ctx.fillText(`LEVEL ${gameState.currentLevel}`, titleX, titleY);
    }

    function moveBall(ball) {
        ball.move();    
        testCollisionBallWithWalls(ball);
        testCollisionBallWithPlayer(ball);
        testCollisionBallWithBlocks(ball);
        if (gameState.hasWall === true) {
            testCollisionBallWithInnerWalls(ball);
        }
    }

    function movePickup(pickup, index) {
        pickup.move();
        testCollisionPickupWithFloor(pickup, index);
        testCollisionPickupWithPlayer(pickup, index);
    }

    function moveProjectile(projectile) {
        projectile.move();
        testCollisionProjectileWithBlocks(projectile);
        testCollisionProjectileWithWalls(projectile);
    }

    function checkLevelCleared() {
        if (blocks.length === 0 && 
            gameState.currentLevel < gameState.totalLevels) {
                gameState.totalScore += gameState.currentScore;
                gameState.currentLevel++;
                return true;
        }
    }

    var checkLoseCondition = function() {
        if (player.lives < 0) {
            gameState.totalScore += gameState.currentScore;
            saveHighScore();
            return true;
        }
    };

    var checkWinCondition = function() {
        if (blocks.length === 0 && 
            gameState.currentLevel === gameState.totalLevels) {
                gameState.totalScore += gameState.currentScore;
                saveHighScore();
                return true;
        }
    };

    var displayStartScreen = function() {    
        const midX = canvas.w / 2;
        const midY = canvas.h / 2;
        
        const buttonColor = 'white';
        const buttonTextColor = 'black';
        const buttonHeight = 50;
        const buttonWidth = 100;
        const buttonText = 'START';
        const buttonX = midX - (buttonWidth / 2);
        const buttonY = midY + 100;
    
        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.font = "bold 100px sans-serif";
        canvas.ctx.fillStyle = 'white';
        canvas.ctx.textAlign = "center";
        canvas.ctx.textBaseline = "middle";
        canvas.ctx.fillText("GUAVANOID", midX, midY);
    
        let startButton = new TextButton(buttonX, buttonY, buttonWidth, buttonHeight, buttonColor, buttonText, buttonTextColor);
        startButton.draw(canvas.ctx);
        
        addButtonListeners(startButton);
    };

    var playerFail = function() {
        player.lives -= 1;
        ball.isAttached = true;
        ball.x = ballInit.ballStartPosX;
        ball.y = ballInit.ballStartPosY;
    };

    // game framework API
    return {
        // need to 'get' top-level objects since
        // they update after initial game object return
        get ball() { return ball },
        get blocks() { return blocks },
        get overlay() { return overlay },
        get player() { return player },
        get wall() { return wall },
        // since these objects contain other objects,
        // only the ref to top-level obj is needed
        audio: audio,
        ballInit: ballInit,
        blockInit: blockInit,
        button: button,
        canvas: canvas,
        gameState: gameState,
        handler: handler,
        htmlElements: htmlElements,
        icon: icon,
        iconInit: iconInit,
        inputState: inputState,
        pickupInit: pickupInit,
        playerInit: playerInit,
        projectileInit: projectileInit,
        spawn: spawn,
        // returned function expressions will be
        // evaluated at call time
        checkLoseCondition: checkLoseCondition,
        checkWinCondition: checkWinCondition,
        displayStartScreen: displayStartScreen,
        playerFail: playerFail,
        start: start
    };
};

window.onload = function init() {
    gameCanvas = document.querySelector("#gameCanvas");
    game = new Game();
    game.displayStartScreen();
};