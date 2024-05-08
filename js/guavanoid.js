"use strict";

var game, gameCanvas, gameContainerDiv;

var Guavanoid = function() {
    // canvas
    let ctx, w, h;

    // i.e. mousePos.x
    let inputState = {};

    let htmlElement = {
        loseDiv: undefined,
        loseSpan: undefined,
        pauseDiv: undefined,
        winDiv: undefined,
        winSpan: undefined
    };

    let player;
    let playerWidth = 50;
    let playerHeight = 10;
    let playerColor = 'black';
    let playerStartPosX, playerStartPosY;
    
    let ball;
    let ballRadius = 5;
    let ballColor = 'red';
    let ballStartPosX, ballStartPosY, ballStartSpeedX, ballStartSpeedY;

    let blocks = [];

    let gameState = {
        currentLevel: 1,
        currentScore: 0,
        displayTitle: true,
        displayTitleStartTime: 0,
        displayTitleTimer: 1500, //ms
        lose: false,
        paused: false,
        totalLevels: 2,
        totalScore: 0,
        win: false
    };

    let audio = {
        blockCollisionSound: undefined,
        failCollisionSound: undefined,
        playerCollisionSound: undefined,
        sfx: true
    };

    // for time based animation
    var delta, then;

    var loadAssets = function(callback) {
        // load embedded sounds
        audio.blockCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56enp6dnZ2dnJycnJybm5ubmpqampqZmZmZmZiYmJiYl5eXl5eWlpaWlpZxTU1OTk9PT1BQUVFRUlJSU1NUVFRVVVVWVlZXV1dYWFhYWVlZWlpaW1tbW1xcXF1dXV1eXl5fX19fYGBgYGFhYWFiYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqampqampra2tra2u0tLOzsrKysbGwsLCvr66urq2traysq6urqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OioqKioaGhoKCgoJ+EV1dXWFhYWVlZWlpaWltbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmdnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb2+vt7e3tra1tbS0tLOzsrKxsbGwsLCvr66urq2traysq6urqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OioqKPWVlaWlpbW1tbXFxcXV1dXV5eXl5fX19fYGBgYWFhYWFiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpqampqamtra2tra2xsbGxsbGxtbW1tbW1ubm5ubm5ubm9vb29vb29wcHBwcHCnuLi3t7e2trW1tLS0s7OysrKxsbCwsK+vrq6ura2trKysq6uqqqqpqamoqKinp6enpqampaWlpKSkpKOjo6KZWlpaWltbW1xcXFxdXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpampqampra2tra2trbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vcHBwcHBwcHCeubi4t7e2tra1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampaWlpaSkpKOjo6OiWlpaW1tbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbm5ubm5ubm5vb29vb29vcHBwcHBwcHCVubi4t7e3tra1tbS0tLOzsrKxsbGwsLCvr66urq2traysq6urqqqqqampqKiop6enpqampqWlpaSkpKOjo6OiY1paW1tbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmdnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbm5ubm5ubm5vb29vb29vcHBwcHBwcHCMubi4t7e3tra1tbS0tLOzsrKysbGwsLCvr66urq2traysrKurqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OibFpaWltbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vcHBwcHBwcHCDubi4uLe3tra1tbS0tLOzsrKysbGwsLCvr66urq2traysrKurq6qqqampqKioqKenp6ampqWlpaSkpKSjo6OidVpaWltbW1xcXFxdXV1eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmZnZ2doaGhoaWlpaWpqampra2trbGxsbG1tbW1tbm5ubm9vb29vcHBwcHBwcXFxcXFycnJycnJzc3Nzc3NzdHR0dHR0dHV1dXV1dXV8paWlpKSjo6KioaGgoKCfn56enZ2dnJycm5uampqZmZmYmJiXl5eWlpaVlZWUlJSUk5OTkpKSkpGRkZGQkJCQf25vb29vcHBwcHFxcXFxcnJycnNzc3NzdHR0dHR1dXV1dXV2dnZ2dnZ3d3d3d3d4eHh4eHh4eXl5eXl5eXl6enp6enp6enp7e3t7e3t7e3t7fHx8fHx8fHx8fHx9fX19fX19fX19fX19fn5+fn5+fn5+fn5+hISEg4ODg4OCgoKCgoKBgYGBgYCAgICAgIA=']
        });
        audio.playerCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56eVVZWVldXV1hYWFlZWVpaWltbW1tcXFxdXV1dXl5eXl9fX19gYGBgYY6pqamoqKinp6empqalpaWlpKSko6N/WltbW1xcXFxdXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NjZGRkba2trKyrq6uqqqqpqamoqKinp6empqZdXV5eXl9fX19gYGBgYWFhYWJiYmJiY2NjY2RkZGRlZWVlZWZmZmZmlK+urq6tra2srKyrq6qqqqmpqaioqINfX2BgYGBhYWFhYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hxsLCvr6+urq6tra2srKurq6qqqqmpqWBgYWFhYWFiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGiWsbCwsK+vr66ura2trKysq6urqqqqhWFhYWJiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaXKysbGwsLCvr66urq2traysq6urqqqqYWFiYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaZeysbGwsLCvr66urq2traysrKurq6qGYWJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpc7KysbGwsLCvr66urq2traysrKurqqphYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpl7KxsbGwsLCvr66urq2traysq6urqoZiYmJiY2NjY2NkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlzsrKxsbGwsK+vr66ura2trKysq6urqmJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWqXsrKxsbCwsK+vrq6ura2trKysq6urhmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpanOysrGxsbCwr6+vrq6ura2srKyrq6uqYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpapeysrGxsLCwr6+urq6tra2srKyrq6uGYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqc7KysbGxsLCvr6+urq6traysrKurq6piYmJiY2NjY2NkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlql7KysbGwsLCvr6+urq2traysrKurq4ZiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpzsrKxsbGwsK+vr66urq2trKysq6urqmJiYmJjY2NjZGRkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWqXsrKxsbCwsK+vr66ura2trKysq6urhmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpanOysrGxsbCwr6+vrq6ura2srKyrq6uqYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpapeysrGxsLCwr6+vrq6tra2srKyrq6uGYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqc7KysbGxsLCvr6+urq6traysrKurq6piYmJiY2NjY2RkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlql7KysbGwsLCvr6+urq2traysrKurq4ZiYmJjY2NkZGRlZWVlZmZmZ2dnZ2hoaGlpaWlqampqa2tra2xsbGx0rKurqqqpqaiop6empqalpaSko6OiomhoaGhpaWlpampqa2tra2xsbGxsbW1tbW5ubm5ub29vb3BwcHBwcXGPoaGhoKCfn56enp2dnZycm5ubmpqag25ubm5vb29vb3BwcHBxcXFxcXJycnJycnNzc3NzdHR0dHR0dXV1dXmXl5eWlpaVlZWUlJSTk5OTkpKSkZGRdHR0dHR0dXV1dXV2dnZ2dnZ3d3d3d3d3eHh4eHh4eHl5eXl5eXl5eoaNjYyMjIyLi4uLioqKioqJiYmJiIiBenp6enp6ent7e3t7e3t7fHx8fHx8fHx8fX19fX19fX19fX5+fn5+f4ODg4KCgoKCgYGBgYGBgYCAgICAgIA=']
        });
        audio.failCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56enp6dnZ2dnJycnJybm5ubmpqampqZmZmZmZiYmJiYl5eXl5eWlpaWlpaVlZWVlZWUlJSUlJSTk5OTk5OSkpKSkpKSkZGRkZGRkZCQkJCQkJCPj4+Pj4+Pj4+Ojo6Ojo6Ojo2NjY2NjY2NjYyMjIyMjIyMjIyLi4JDQ0RERUVGRkdHSEhISUlKSktLS0xMTU1NTk5PT09QUFFRUVJSUlNTU1RUVVVVVlZWV1dXWFhYWFlZWVpaWltbW1tcXFxdXV1dXl5eX19fX2BgYGBhYWFhYmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpampqampqa2tra2trbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vb3BwcHBwcHBwcXFxcXFxcXFxcnJycnJycnJyc3Nzc3Nzc3Nzc3R0dHR0dHR0dHR0dXV1dXV1dXV1dXV1dnZ2dnZ2dnZ2dnZ2dnd3d3d3d3d3d3d3d3d3eHh4eHicwL+/vr69vby8u7u7urq5ubi4t7e2tra1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampqWlpaSkpKOjo6OioqKhoaGhoKCgoJ+fn5+enp6enZ2dnZycnJycm5ubm5qampqamZmZmZmYmJiYmJeXl5eXlpaWlpaWlZWVlZVwTE1NTU5OT09PUFBRUVFSUlJTU1NUVFVVVVZWVldXV1hYWFhZWVlaWlpbW1tbXFxcXV1dXV5eXl9fX19gYGBgYWFhYWJiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpqampqamtra2tra2xsbGxsbG1tbW1tbW1ubm5ubm5ub29vb29vb29wcHBwcHBwcHFxcXFxcXFxcXJycnJycnJycnNzc3Nzc3Nzc3N0dHR0dHR0dHR0dHV1dXV1dXV1dXV1dXZ2dnZ2dnZ2dnZ2dnZ3d3d3d3d3d3d3d3d3d3d4eHh4eHh4eHh4eHh4eHh4eXl5eXl5eXl5uMHAwL+/vr69vby8u7u6urq5ubi4t7e2trW1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampaWlpaSkpKOjo6OioqKhoaGhoKCgoJ+fn5+enp6enZ2dnZycnJycm5ubm5qampqamZmZmZmYmJiYmJeXl5eXlpaWlpaWlZWVVU1NTk5OT09QUFBRUVFSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVlaWlpbW1tcXFxcXV1dXl5eXl9fX19gYGBgYWFhYWJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWpqampqamtra2tra2xsbGxsbG1tbW1tbW1ubm5ubm5ub29vb29vb29wcHBwcHBwcHFxcXFxcXFxcnJycnJycnJycnNzc3Nzc3Nzc3N0dHR0dHR0dHR0dXV1dXV1dXV1dXV1dnZ2dnZ2dnZ2dnZ2dnZ3d3d3d3d3d3d3d3d3d3h4eHh4eHh4eHh4eHh4eHh4eXl5eXl5eXl5i8HBwMC/v76+vb28vLu7urq5ubi4uLe3tra1tbW0tLOzsrKysbGwsLCvr6+urq2traysrKurq6qqqqmpqaioqKenp6ampqWlpaSkpKSjo6OioqKioaGhoaCgoKCfn5+fnp6enp2dnZ2cnJycm5ubm5uampqampmZmZmYmJiYmJiXl5eXl5aWlpaWlZWVg01OTk9PUFFRUlJTU1RUVVVWVldXV1hYWVlaWltbW1xcXV1dXl5fX19gYGBhYWJiYmNjY2RkZGVlZWZmZmZnZ2doaGhpaWlpampqamtra2tsbGxsbW1tbW5ubm5ub29vb29wcHBwcHFxcXFxcnJycnJyc3Nzc3NzdHR0dHR0dXV1dXV1dXZ2dnZ2dnZ2d3d3d3d3d3d4eHh4eHh4eHh5eXl5eXl5eXl5eXp6enp6enp6enp6e3t7e3t7e3t7e3t7e3t8fHx8fHx8fHx8fHx8fHx8fX19fX19fX19fX19fX19fX19fX19fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+foaJiYmJiIiIiIeHh4aGhoaGhYWFhYSEhISEg4ODg4OCgoKCgoGBgYGBgYCAgICAgIA=']
        });
        
        // call the callback function passed as a parameter, 
        // we're done with loading assets
        callback();
    };

    var start = function() {
        // reset game state
        gameState.currentScore = 0;

        // get canvas element
        gameCanvas = document.querySelector("#gameCanvas");

        // get the width and height of the canvas
        w = gameCanvas.width;
        h = gameCanvas.height;

        // get HTML elements
        htmlElement.winDiv = document.querySelector("#winDiv");
        htmlElement.winSpan = document.querySelector("#winSpan");
        htmlElement.loseDiv = document.querySelector("#loseDiv");
        htmlElement.loseSpan = document.querySelector("#loseSpan");
        htmlElement.pauseDiv = document.querySelector("#pauseDiv");

        // create player
        playerStartPosX = (w / 2) - (playerWidth / 2);
        playerStartPosY = h - 50;
        player = new Player(playerStartPosX, playerStartPosY, playerWidth, playerHeight, playerColor);

        // create ball
        ballStartPosX = w / 2;
        ballStartPosY = playerStartPosY - ballRadius;
        ballStartSpeedX = 300; // 60 fps * 5 px = 300 px/s
        ballStartSpeedY = -300; // 60 fps * 5 px = 300 px/s
        ball = new Ball(ballStartPosX, ballStartPosY, ballRadius, ballColor, ballStartSpeedX, ballStartSpeedY);

        // create blocks
        blocks = createBlocks();

        // required to draw 2d shapes to the canvas object
        ctx = gameCanvas.getContext("2d");

        // add event listeners to the canvas object
        addListeners(gameCanvas, ball, blocks, inputState, gameState, htmlElement);

        // Load sounds and images, then when this is done, start the mainLoop
        loadAssets(function() {
            // We enter here only when all assets have been loaded
            // start the game
            gameState.displayTitle = true;
            gameState.displayTitleStartTime = performance.now();
            mainLoop();
        });
    };

    function displayTitleScreen() {
        const titleX = w / 2;
        const titleY = h / 2;

        ctx.clearRect(0, 0, w, h);
        ctx.font = "bold 100px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`Level ${gameState.currentLevel}`, titleX, titleY);
    }

    function mainLoop(now) {
        if (now - gameState.displayTitleStartTime > gameState.displayTitleTimer) {
            gameState.displayTitle = false;

            if (!gameState.paused) {
                // get the time between frames
                delta = now - then;

                ball.incrementX = calcIncrement(ball.speedX, delta);
                ball.incrementY = calcIncrement(ball.speedY, delta);

                // clear the canvas
                ctx.clearRect(0, 0, w, h);
                
                player.draw(ctx);
                ball.draw(ctx);

                drawAllBlocks(blocks);
                displayHUD(gameState.currentLevel, gameState.currentScore, player.lives);

                if (!ball.isAttached) {
                    moveBall(ball);
                }

                // make the player follow the mouse
                // test if the mouse is positioned over the canvas first
                if(inputState.mousePos !== undefined) {
                    //player.move(mousePos.x, mousePos.y);
                    player.move(inputState.mousePos.x, w);
                    if (ball.isAttached) {
                        ball.followPlayer(inputState.mousePos.x, player, w);
                    }
                }
            }
    
            if (!checkWinCondition() && !checkLoseCondition()) {
                // copy the current time to the old time
                then = now;
                // ask for a new animation frame
                requestAnimationFrame(mainLoop);
            }
        } else if (gameState.displayTitle) {
            displayTitleScreen();
            requestAnimationFrame(mainLoop);
        }
    }

    function calcIncrement(speed, del) {
        return (speed*del) / 1000;
    }

    function createBlocks() {
        let blockArray = [];
        let blockGap = 3;
        let blockWidth = 60;
        let blockHeight = 20;

        if (gameState.currentLevel === 1) {
            blockArray = createLevel1Layout(blockArray, blockGap, blockWidth, blockHeight, w);
        } else if (gameState.currentLevel === 2) {
            blockArray = createLevel2Layout(blockArray, blockGap, blockWidth, blockHeight, w);
        }

        return blockArray;
    }

    function drawAllBlocks(blockArray) {
        blockArray.forEach(function(b) {
            b.draw(ctx);
        });
    }

    function moveBall(b) {
        b.move();    
        testCollisionBallWithWalls(b, audio, h, w);
        testCollisionBallWithPlayer(b, audio, player, ballStartSpeedX);
        testCollisionBallWithBlocks(b, audio, blocks, gameState);
    }

    function displayHUD(lvl, score, lives) {
        let hudXLeftAlign = 40;
        let hudXCenterAlign = w / 2;
        let huxXRightAlign = w - 40;
        let hudYTopAlign = 5;

        ctx.font = "10px sans-serif";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        ctx.fillText(`Level: ${lvl}`, hudXLeftAlign, hudYTopAlign);
        ctx.textAlign = "center";
        ctx.fillText(`Score: ${score}`, hudXCenterAlign, hudYTopAlign);
        ctx.textAlign = "right";
        ctx.fillText(`Lives: ${lives}`, huxXRightAlign, hudYTopAlign);
    }

    var checkWinCondition = function() {
        if (blocks.length === 0) {
            gameState.totalScore += gameState.currentScore;

            if (gameState.currentLevel === gameState.totalLevels) {
                gameState.win = true;

                // display win screen
                gameCanvas.classList.add("hidden");
                gameContainerDiv.classList.add("hidden");
                htmlElement.winDiv.classList.remove("hidden");
                htmlElement.winSpan.textContent = "Score: " + gameState.totalScore;
            } else {
                gameState.currentLevel++;
                start();
            }
        }

        return gameState.win;
    }

    var checkLoseCondition = function() {
        if (player.lives < 0) {
            gameState.lose = true;
            gameState.totalScore += gameState.currentScore;

            // display lose screen
            gameCanvas.classList.add("hidden");
            gameContainerDiv.classList.add("hidden");
            htmlElement.loseDiv.classList.remove("hidden");
            htmlElement.loseSpan.textContent = "Score: " + gameState.totalScore;
        }

        return gameState.lose;
    }

    var playerFail = function() {
        player.lives -= 1;
        ball.isAttached = true;
        ball.x = ballStartPosX;
        ball.y = ballStartPosY;
    }

    var toggleSFX = function() {
        if (audio.sfx === true) {
            audio.sfx = false;
        } else {
            audio.sfx = true;
        }
    };

    var getSFX = function() {
        return audio.sfx;
    };

    return {
        start: start,
        checkWinCondition: checkWinCondition,
        checkLoseCondition: checkLoseCondition,
        playerFail: playerFail,
        toggleSFX: toggleSFX,
        getSFX: getSFX
    };
};

window.onload = function init() {
    let startButton = document.querySelector("#startButton");
    let sfxToggleBtn = document.querySelector("#sfxToggleBtn");
    let startDiv = document.querySelector("#startDiv");
    gameContainerDiv = document.querySelector("#gameContainerDiv");
    gameCanvas = document.querySelector("#gameCanvas");
    game = new Guavanoid();

    startButton.addEventListener('click', function(evt) {
        startButton.classList.add("hidden");
        startDiv.classList.add("hidden");
        gameContainerDiv.classList.remove("hidden");
        gameCanvas.classList.remove("hidden");
        game.start();
    });

    sfxToggleBtn.addEventListener('click', function(evt) {
        game.toggleSFX();
        if (game.getSFX()) {
            sfxToggleBtn.textContent = "SFX ON";
        } else {
            sfxToggleBtn.textContent = "SFX OFF";
        }
    });
};