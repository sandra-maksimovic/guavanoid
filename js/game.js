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
        ballColor: 'rgb(130, 199, 51)',
        ballRadius: 5,
        ballStartPosX: canvas.w / 2,
        ballStartPosY: undefined, // set later in start(), requires ballInit.ballRadius value for init
        ballStartSpeedX: 300, // 60 fps * 5 px = 300 px/s
        ballStartSpeedY: -300 // 60 fps * 5 px = 300 px/s
    };

    let blocks = [];

    let blockInit = {
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
        loaded: false,
        paused: false,
        pickupGrowthTimer: 10000, //ms
        pickupGrowthTimerStartTime: 0,
        totalLevels: 5,
        totalScore: 0
    };

    let handler = {
        textButtonClick: undefined,
        textButtonHover: undefined
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

    const iconInit = {
        color: 'gray',
        colorHover: 'lightgray',
        size: 24
    };

    let inputState = {};

    let overlay;

    let overlayInit = {
        color: 'rgba(255, 255, 255, 0.5)', // white at 50% opacity
        font: "14px sans-serif",
        lineHeight: 18,
        margin: 6,
        pickupIconRadius: 8,
        height: 150,
        width: 290,
        text: "Click once to launch the ball.\n\
Move paddle left and right with the mouse.\n\
Collect pickups to gain advantages.\n\
O - Extra life\n\
O - Double size for 10 seconds max\n\
O - 3x laser shots max (click to shoot)\n\
O - 10 points\n\
ESC - Toggle pause",
        textAlign: 'left',
        textColor: 'black',
        x: canvas.w / 2,
        y: (canvas.h / 2) + (canvas.h / 8)
    };

    let pickupInit = {
        numPickups: 3,
        pickupTypeArray: [
            { type: 'size', color: 'blue' },
            { type: 'life', color: 'green' },
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

    const textButtonInit = {
        color: 'white',
        colorHover: 'rgb(130, 199, 51)',
        font: "bold 20px sans-serif",
        height: 50,
        textAlign: "center",
        textBaseline: "middle",
        textColor: 'black',
        textColorHover: 'white',
        width: 100,
        get x() { return (canvas.w/2) - (this.width/2) },
        get y() { return (canvas.h/2) + (canvas.h/4) - (this.height/2) }
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
        spawn.activePickupArray = [];
        spawn.activeProjectileArray = [];
        wall = undefined;

        playerInit.playerStartPosX = (canvas.w / 2) - (playerInit.playerWidth / 2);
        player = new Player(playerInit.playerStartPosX, 
                            playerInit.playerStartPosY, 
                            playerInit.playerWidth, 
                            playerInit.playerHeight, 
                            playerInit.playerColor, 
                            playerInit.playerLives, 
                            playerInit.playerProjectiles);

        ballInit.ballStartPosY = playerInit.playerStartPosY - ballInit.ballRadius;
        ball = new Ball(ballInit.ballStartPosX, 
                        ballInit.ballStartPosY, 
                        ballInit.ballRadius, 
                        ballInit.ballColor, 
                        ballInit.ballStartSpeedX, 
                        ballInit.ballStartSpeedY);

        blocks = createBlocks(gameState.currentLevel);

        overlay = new Overlay(overlayInit.x, 
                              overlayInit.y, 
                              overlayInit.width, 
                              overlayInit.height, 
                              overlayInit.color, 
                              overlayInit.font, 
                              overlayInit.lineHeight, 
                              overlayInit.margin, 
                              overlayInit.pickupIconRadius, 
                              overlayInit.text, 
                              overlayInit.textAlign, 
                              overlayInit.textColor);

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

            button.legendToggleBtn = new ImageButton(legendToggleBtnX, 
                                                     legendToggleBtnY, 
                                                     iconInit.size, 
                                                     iconInit.size, 
                                                     iconInit.color, 
                                                     iconInit.colorHover, 
                                                     icon.legendOff);

            if (audio.isSFX) {
                button.sfxToggleBtn = new ImageButton(sfxToggleBtnX, 
                                                      sfxToggleBtnY, 
                                                      iconInit.size, 
                                                      iconInit.size, 
                                                      iconInit.color, 
                                                      iconInit.colorHover, 
                                                      icon.sfxOn);
            } else {
                button.sfxToggleBtn = new ImageButton(sfxToggleBtnX, 
                                                      sfxToggleBtnY, 
                                                      iconInit.size, 
                                                      iconInit.size, 
                                                      iconInit.color, 
                                                      iconInit.colorHover, 
                                                      icon.sfxOff);
            }

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
                
                // revert player width if size pickup timer has elapsed
                if ((player.sizeActive === true) && 
                    (now - gameState.pickupGrowthTimerStartTime > gameState.pickupGrowthTimer)) {
                        player.width = playerInit.playerWidth;
                        player.sizeActive = false;
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

                if (wall !== undefined) {
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
                displayResultScreen('rgb(130, 199, 51)', 'YOU WIN');

            } else if (checkLoseCondition()) {
                removeListeners();
                displayResultScreen('white', 'YOU LOSE');

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

    function createBlocks(currentLevel) {
        let blockArray = [];

        switch(currentLevel) {
            case 1:
                blockArray = createLevel1Layout();
                break;
            case 2:
                blockArray = createLevel2Layout();
                break;
            case 3:
                blockArray = createLevel3Layout();
                break;
            case 4:
                blockArray = createLevel4Layout();
                break;
            case 5:
                blockArray = createLevel5Layout();
                break;
        }

        return blockArray;
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
        
        const buttonText = 'RESTART';
        const buttonY = midY + (canvas.h-midY) / 2;
        
        //let restartButton = new TextButton(buttonX, buttonY, buttonWidth, buttonHeight, buttonColor, buttonText, buttonTextColor);
        let restartButton = new TextButton(textButtonInit.x, 
                                           textButtonInit.y, 
                                           textButtonInit.width, 
                                           textButtonInit.height, 
                                           textButtonInit.color, 
                                           textButtonInit.colorHover, 
                                           textButtonInit.font,
                                           buttonText, 
                                           textButtonInit.textColor, 
                                           textButtonInit.textColorHover, 
                                           textButtonInit.textAlign, 
                                           textButtonInit.textBaseline);
        restartButton.draw(canvas.ctx);

        addTextButtonListeners(restartButton);

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
        if (wall !== undefined) {
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

    var displayStartScreen = function(img) {
        const midX = canvas.w / 2;
        const midY = canvas.h / 2;
        
        const buttonText = 'START';
    
        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.font = "bold 100px sans-serif";
        canvas.ctx.fillStyle = 'white';
        canvas.ctx.textAlign = "center";
        canvas.ctx.textBaseline = "middle";
        canvas.ctx.fillText("GUAVANOID", midX, midY);

        canvas.ctx.drawImage(img, 439, 170, img.naturalWidth, img.naturalHeight);
    
        let startButton = new TextButton(textButtonInit.x, 
                                         textButtonInit.y, 
                                         textButtonInit.width, 
                                         textButtonInit.height, 
                                         textButtonInit.color, 
                                         textButtonInit.colorHover, 
                                         textButtonInit.font,
                                         buttonText, 
                                         textButtonInit.textColor, 
                                         textButtonInit.textColorHover, 
                                         textButtonInit.textAlign, 
                                         textButtonInit.textBaseline);
        startButton.draw(canvas.ctx);
        
        addTextButtonListeners(startButton);
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
        // for setting objects from outside of the GF
        set wall(newWall) { wall = newWall; },
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
        textButtonInit: textButtonInit,
        wallInit: wallInit,
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
    
    const logoImg = new Image();
    logoImg.src = "images/guava.png";

    logoImg.onload = function() {
        game = new Game();
        game.displayStartScreen(logoImg);
    };
};