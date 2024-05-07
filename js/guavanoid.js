"use strict";

var Guavanoid = function() {
    // canvas
    let canvas, ctx, w, h;

    // mouse
    let mousePos;

    // HTML elements
    let winDiv, winSpan, loseDiv, loseSpan, pauseDiv, gameContainer;

    // player
    let player;
    let playerWidth = 50;
    let playerHeight = 10;
    let playerColor = 'black';
    let playerStartPosX, playerStartPosY;
    
    // ball
    let ball;
    let ballRadius = 5;
    let ballColor = 'red';
    let ballStartPosX, ballStartPosY, ballStartSpeedX, ballStartSpeedY;

    // blocks
    let blocks = [];

    // game state
    let win = false;
    let levelWin = false;
    let lose = false;
    let paused = false;
    let currentScore = 0;
    let totalScore = 0;
    let currentLevel = 1;
    let totalLevels = 2;
    let displayTitle, displayTitleStartTime;
    let displayTitleTimer = 1500; //ms

    // audio
    let sfx = true;
    let blockCollisionSound, playerCollisionSound, failCollisionSound;

    // for time based animation
    var delta, then;

    var loadAssets = function(callback) {
        // load embedded sounds
        blockCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56enp6dnZ2dnJycnJybm5ubmpqampqZmZmZmZiYmJiYl5eXl5eWlpaWlpZxTU1OTk9PT1BQUVFRUlJSU1NUVFRVVVVWVlZXV1dYWFhYWVlZWlpaW1tbW1xcXF1dXV1eXl5fX19fYGBgYGFhYWFiYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqampqampra2tra2u0tLOzsrKysbGwsLCvr66urq2traysq6urqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OioqKioaGhoKCgoJ+EV1dXWFhYWVlZWlpaWltbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmdnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb2+vt7e3tra1tbS0tLOzsrKxsbGwsLCvr66urq2traysq6urqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OioqKPWVlaWlpbW1tbXFxcXV1dXV5eXl5fX19fYGBgYWFhYWFiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpqampqamtra2tra2xsbGxsbGxtbW1tbW1ubm5ubm5ubm9vb29vb29wcHBwcHCnuLi3t7e2trW1tLS0s7OysrKxsbCwsK+vrq6ura2trKysq6uqqqqpqamoqKinp6enpqampaWlpKSkpKOjo6KZWlpaWltbW1xcXFxdXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpampqampra2tra2trbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vcHBwcHBwcHCeubi4t7e2tra1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampaWlpaSkpKOjo6OiWlpaW1tbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbm5ubm5ubm5vb29vb29vcHBwcHBwcHCVubi4t7e3tra1tbS0tLOzsrKxsbGwsLCvr66urq2traysq6urqqqqqampqKiop6enpqampqWlpaSkpKOjo6OiY1paW1tbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmdnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbm5ubm5ubm5vb29vb29vcHBwcHBwcHCMubi4t7e3tra1tbS0tLOzsrKysbGwsLCvr66urq2traysrKurqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OibFpaWltbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vcHBwcHBwcHCDubi4uLe3tra1tbS0tLOzsrKysbGwsLCvr66urq2traysrKurq6qqqampqKioqKenp6ampqWlpaSkpKSjo6OidVpaWltbW1xcXFxdXV1eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmZnZ2doaGhoaWlpaWpqampra2trbGxsbG1tbW1tbm5ubm9vb29vcHBwcHBwcXFxcXFycnJycnJzc3Nzc3NzdHR0dHR0dHV1dXV1dXV8paWlpKSjo6KioaGgoKCfn56enZ2dnJycm5uampqZmZmYmJiXl5eWlpaVlZWUlJSUk5OTkpKSkpGRkZGQkJCQf25vb29vcHBwcHFxcXFxcnJycnNzc3NzdHR0dHR1dXV1dXV2dnZ2dnZ3d3d3d3d4eHh4eHh4eXl5eXl5eXl6enp6enp6enp7e3t7e3t7e3t7fHx8fHx8fHx8fHx9fX19fX19fX19fX19fn5+fn5+fn5+fn5+hISEg4ODg4OCgoKCgoKBgYGBgYCAgICAgIA=']
        });
        playerCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56eVVZWVldXV1hYWFlZWVpaWltbW1tcXFxdXV1dXl5eXl9fX19gYGBgYY6pqamoqKinp6empqalpaWlpKSko6N/WltbW1xcXFxdXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NjZGRkba2trKyrq6uqqqqpqamoqKinp6empqZdXV5eXl9fX19gYGBgYWFhYWJiYmJiY2NjY2RkZGRlZWVlZWZmZmZmlK+urq6tra2srKyrq6qqqqmpqaioqINfX2BgYGBhYWFhYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hxsLCvr6+urq6tra2srKurq6qqqqmpqWBgYWFhYWFiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGiWsbCwsK+vr66ura2trKysq6urqqqqhWFhYWJiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaXKysbGwsLCvr66urq2traysq6urqqqqYWFiYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaZeysbGwsLCvr66urq2traysrKurq6qGYWJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpc7KysbGwsLCvr66urq2traysrKurqqphYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpl7KxsbGwsLCvr66urq2traysq6urqoZiYmJiY2NjY2NkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlzsrKxsbGwsK+vr66ura2trKysq6urqmJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWqXsrKxsbCwsK+vrq6ura2trKysq6urhmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpanOysrGxsbCwr6+vrq6ura2srKyrq6uqYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpapeysrGxsLCwr6+urq6tra2srKyrq6uGYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqc7KysbGxsLCvr6+urq6traysrKurq6piYmJiY2NjY2NkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlql7KysbGwsLCvr6+urq2traysrKurq4ZiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpzsrKxsbGwsK+vr66urq2trKysq6urqmJiYmJjY2NjZGRkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWqXsrKxsbCwsK+vr66ura2trKysq6urhmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpanOysrGxsbCwr6+vrq6ura2srKyrq6uqYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpapeysrGxsLCwr6+vrq6tra2srKyrq6uGYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqc7KysbGxsLCvr6+urq6traysrKurq6piYmJiY2NjY2RkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlql7KysbGwsLCvr6+urq2traysrKurq4ZiYmJjY2NkZGRlZWVlZmZmZ2dnZ2hoaGlpaWlqampqa2tra2xsbGx0rKurqqqpqaiop6empqalpaSko6OiomhoaGhpaWlpampqa2tra2xsbGxsbW1tbW5ubm5ub29vb3BwcHBwcXGPoaGhoKCfn56enp2dnZycm5ubmpqag25ubm5vb29vb3BwcHBxcXFxcXJycnJycnNzc3NzdHR0dHR0dXV1dXmXl5eWlpaVlZWUlJSTk5OTkpKSkZGRdHR0dHR0dXV1dXV2dnZ2dnZ3d3d3d3d3eHh4eHh4eHl5eXl5eXl5eoaNjYyMjIyLi4uLioqKioqJiYmJiIiBenp6enp6ent7e3t7e3t7fHx8fHx8fHx8fX19fX19fX19fX5+fn5+f4ODg4KCgoKCgYGBgYGBgYCAgICAgIA=']
        });
        failCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56enp6dnZ2dnJycnJybm5ubmpqampqZmZmZmZiYmJiYl5eXl5eWlpaWlpaVlZWVlZWUlJSUlJSTk5OTk5OSkpKSkpKSkZGRkZGRkZCQkJCQkJCPj4+Pj4+Pj4+Ojo6Ojo6Ojo2NjY2NjY2NjYyMjIyMjIyMjIyLi4JDQ0RERUVGRkdHSEhISUlKSktLS0xMTU1NTk5PT09QUFFRUVJSUlNTU1RUVVVVVlZWV1dXWFhYWFlZWVpaWltbW1tcXFxdXV1dXl5eX19fX2BgYGBhYWFhYmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpampqampqa2tra2trbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vb3BwcHBwcHBwcXFxcXFxcXFxcnJycnJycnJyc3Nzc3Nzc3Nzc3R0dHR0dHR0dHR0dXV1dXV1dXV1dXV1dnZ2dnZ2dnZ2dnZ2dnd3d3d3d3d3d3d3d3d3eHh4eHicwL+/vr69vby8u7u7urq5ubi4t7e2tra1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampqWlpaSkpKOjo6OioqKhoaGhoKCgoJ+fn5+enp6enZ2dnZycnJycm5ubm5qampqamZmZmZmYmJiYmJeXl5eXlpaWlpaWlZWVlZVwTE1NTU5OT09PUFBRUVFSUlJTU1NUVFVVVVZWVldXV1hYWFhZWVlaWlpbW1tbXFxcXV1dXV5eXl9fX19gYGBgYWFhYWJiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpqampqamtra2tra2xsbGxsbG1tbW1tbW1ubm5ubm5ub29vb29vb29wcHBwcHBwcHFxcXFxcXFxcXJycnJycnJycnNzc3Nzc3Nzc3N0dHR0dHR0dHR0dHV1dXV1dXV1dXV1dXZ2dnZ2dnZ2dnZ2dnZ3d3d3d3d3d3d3d3d3d3d4eHh4eHh4eHh4eHh4eHh4eXl5eXl5eXl5uMHAwL+/vr69vby8u7u6urq5ubi4t7e2trW1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampaWlpaSkpKOjo6OioqKhoaGhoKCgoJ+fn5+enp6enZ2dnZycnJycm5ubm5qampqamZmZmZmYmJiYmJeXl5eXlpaWlpaWlZWVVU1NTk5OT09QUFBRUVFSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVlaWlpbW1tcXFxcXV1dXl5eXl9fX19gYGBgYWFhYWJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWpqampqamtra2tra2xsbGxsbG1tbW1tbW1ubm5ubm5ub29vb29vb29wcHBwcHBwcHFxcXFxcXFxcnJycnJycnJycnNzc3Nzc3Nzc3N0dHR0dHR0dHR0dXV1dXV1dXV1dXV1dnZ2dnZ2dnZ2dnZ2dnZ3d3d3d3d3d3d3d3d3d3h4eHh4eHh4eHh4eHh4eHh4eXl5eXl5eXl5i8HBwMC/v76+vb28vLu7urq5ubi4uLe3tra1tbW0tLOzsrKysbGwsLCvr6+urq2traysrKurq6qqqqmpqaioqKenp6ampqWlpaSkpKSjo6OioqKioaGhoaCgoKCfn5+fnp6enp2dnZ2cnJycm5ubm5uampqampmZmZmYmJiYmJiXl5eXl5aWlpaWlZWVg01OTk9PUFFRUlJTU1RUVVVWVldXV1hYWVlaWltbW1xcXV1dXl5fX19gYGBhYWJiYmNjY2RkZGVlZWZmZmZnZ2doaGhpaWlpampqamtra2tsbGxsbW1tbW5ubm5ub29vb29wcHBwcHFxcXFxcnJycnJyc3Nzc3NzdHR0dHR0dXV1dXV1dXZ2dnZ2dnZ2d3d3d3d3d3d4eHh4eHh4eHh5eXl5eXl5eXl5eXp6enp6enp6enp6e3t7e3t7e3t7e3t7e3t8fHx8fHx8fHx8fHx8fHx8fX19fX19fX19fX19fX19fX19fX19fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+foaJiYmJiIiIiIeHh4aGhoaGhYWFhYSEhISEg4ODg4OCgoKCgoGBgYGBgYCAgICAgIA=']
        });
        
        // call the callback function passed as a parameter, 
        // we're done with loading assets
        callback();
    };

    var start = function() {
        // reset game conditions
        levelWin = false;
        currentScore = 0;

        // get canvas element
        canvas = document.querySelector("#gameCanvas");

        // get the width and height of the canvas
        w = canvas.width;
        h = canvas.height;

        // get HTML elements
        winDiv = document.querySelector("#winDiv");
        winSpan = document.querySelector("#winSpan");
        loseDiv = document.querySelector("#loseDiv");
        loseSpan = document.querySelector("#loseSpan");
        pauseDiv = document.querySelector("#pauseDiv");
        gameContainer = document.querySelector("#gameContainer");

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
        ctx = canvas.getContext("2d");

        // add a mousemove event listener to the canvas to track user mouse movement
        canvas.addEventListener('mousemove', mouseMoved);

        // add a mouseclick event listener to the canvas to move the ball
        canvas.addEventListener('click', processClick);

        // add a keydown event listener to the window to pause the game
        document.addEventListener('keydown', processKeyDown);
        
        // for testing
        //document.addEventListener('keydown', clearBlocks);

        // Load sounds and images, then when this is done, start the mainLoop
        loadAssets(function() {
            // We enter here only when all assets have been loaded
            // start the game
            displayTitle = true;
            displayTitleStartTime = performance.now();
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
        ctx.fillText(`Level ${currentLevel}`, titleX, titleY);
    }

    function mainLoop(now) {
        if (now - displayTitleStartTime > displayTitleTimer) {
            displayTitle = false;

            if (!paused) {
                // get the time between frames
                delta = now - then;

                ball.incrementX = calcIncrement(ball.speedX, delta);
                ball.incrementY = calcIncrement(ball.speedY, delta);

                // clear the canvas
                ctx.clearRect(0, 0, w, h);
                
                player.draw(ctx);
                ball.draw(ctx);

                drawAllBlocks(blocks);
                displayHUD(currentLevel, currentScore, player.lives);

                if (!ball.isAttached) {
                    moveBall(ball);
                }

                // make the player follow the mouse
                // test if the mouse is positioned over the canvas first
                if(mousePos !== undefined) {
                    //player.move(mousePos.x, mousePos.y);
                    player.move(mousePos.x, w);
                    if (ball.isAttached) {
                        ball.followPlayer(mousePos.x, player, w);
                    }
                }
            }
    
            if (!checkWinCondition() && !checkLoseCondition()) {
                // copy the current time to the old time
                then = now;
                // ask for a new animation frame
                requestAnimationFrame(mainLoop);
            }
        } else if (displayTitle) {
            displayTitleScreen();
            requestAnimationFrame(mainLoop);
        }
    }

    function calcIncrement(speed, del) {
        return (speed*del) / 1000;
    }

    function processClick(evt) {
        ball.isAttached = false;
    }

    function processKeyDown(evt) {
        if (!checkWinCondition() && !checkLoseCondition()) {
            if (evt.key === "Escape") {
                if (paused === false) {
                    paused = true;
                    pauseDiv.classList.remove("hidden");
                } else {
                    paused = false;
                    pauseDiv.classList.add("hidden");
                }
            }
        }
    }

    // called when the user moves the mouse
    function mouseMoved(evt) {
        mousePos = getMousePos(canvas, evt);
    }

    function getMousePos(canvas, evt) {
        // necessary to work in the local canvas coordinate system
        let rect = canvas.getBoundingClientRect();
        
        // we can return the mouse coords as a simple object in JS
        return { x: evt.clientX - rect.left }
    }

    function createBlocks() {
        let blockArray = [];
        let blockGap = 3;
        let blockWidth = 60;
        let blockHeight = 20;

        if (currentLevel === 1) {
            blockArray = createLevel1Layout(blockArray, blockGap, blockWidth, blockHeight, w);
        } else if (currentLevel === 2) {
            blockArray = createLevel2Layout(blockArray, blockGap, blockWidth, blockHeight, w);
        }

        return blockArray;
    }

    // for testing
    /*function clearBlocks(evt) {
        if (evt.key === "b") {
            blocks.splice(0, blocks.length);
        }
    }*/

    function drawAllBlocks(blockArray) {
        blockArray.forEach(function(b) {
            b.draw(ctx);
        });
    }

    function moveBall(b) {
        b.move();    
        testCollisionBallWithWalls(b);
        testCollisionBallWithPlayer(b);
        testCollisionBallWithBlocks(b);
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

    function checkWinCondition() {
        if (blocks.length === 0) {
            levelWin = true;
            totalScore += currentScore;

            if (currentLevel === totalLevels) {
                win = true;

                // display win screen
                canvas.classList.add("hidden");
                gameContainer.classList.add("hidden");
                winDiv.classList.remove("hidden");
                winSpan.textContent = "Score: " + totalScore;
            } else {
                currentLevel++;
                start();
            }
        }

        return win;
    }

    function checkLoseCondition() {
        if (player.lives < 0) {
            lose = true;

            // display lose screen
            canvas.classList.add("hidden");
            gameContainer.classList.add("hidden");
            loseDiv.classList.remove("hidden");
            loseSpan.textContent = "Score: " + totalScore;
        }

        return lose;
    }

    function playerFail() {
        player.lives -= 1;
        ball.isAttached = true;
        ball.x = ballStartPosX;
        ball.y = ballStartPosY;
    }

    function testCollisionBallWithWalls(b) {
        // COLLISION WITH VERTICAL WALLS
        if ((b.x + b.radius) > w) {
            // the ball hit the right wall
            // change horizontal direction
            b.speedX = -b.speedX;
            
            // put the ball at the collision point
            b.x = w - b.radius;
        } else if ((b.x - b.radius) < 0) {
            // the ball hit the left wall
            // change horizontal direction
            b.speedX = -b.speedX;
            
            // put the ball at the collision point
            b.x = b.radius;
        }
    
        // COLLISIONS WTH HORIZONTAL WALLS
        // Not in the else as the ball can touch both
        // vertical and horizontal walls in corners
        if ((b.y + b.radius) > h) {
            // the ball hit the bottom wall
            // change vertical direction
            ////b.speedY = -b.speedY;
            
            // put the ball at the collision point
            ////b.y = h - b.radius;

            if (sfx) { failCollisionSound.play(); }
            playerFail();
        } else if ((b.y - b.radius) < 0) {
            // the ball hit the top wall
            // change vertical direction
            b.speedY = -b.speedY;
            
            // put the ball at the collision point
            b.y = b.radius;
        }
    }

    function testCollisionBallWithPlayer(b) {
        if(circRectsOverlap(player.x, player.y, player.width, player.height, b.x, b.y, b.radius)) {
            let ballRightSide = b.x + b.radius;
            let ballLeftSide = b.x - b.radius;
            let playerRightSide = player.x + player.width;
            let playerLeftSide = player.x;

            let ballTopSide = b.y - b.radius;
            let ballBottomSide = b.y + b.radius;
            let playerTopSide = player.y;
            let playerBottomSide = player.y + player.height;

            let ballGoingRight = b.speedX > 0;
            let ballGoingLeft = b.speedX < 0;
            let ballGoingUp = b.speedY < 0;
            let ballGoingDown = b.speedY > 0;

            if (sfx) { playerCollisionSound.play(); }

            // check if the ball hit the LEFT side of the player
            if (ballRightSide > playerLeftSide && ballGoingRight) {
                    
                // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                if (b.y > playerTopSide && b.y < playerBottomSide) {
                    // change horizontal direction
                    b.speedX = -b.speedX;
                    ballGoingRight = false;
                    ballGoingLeft = true;
                    
                    // put the ball at the collision point
                    b.x = ballLeftSide - b.radius;
                    
                    // update the horizontal ball bounds
                    ballLeftSide = b.x - b.radius;
                    ballRightSide = b.x + b.radius;
                }

            // otherwise check if the ball hit the RIGHT side of the player
            } else if (ballLeftSide < playerRightSide && ballGoingLeft) {
                    
                // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                if (b.y > playerTopSide && b.y < playerBottomSide) {
                    // change horizontal direction
                    b.speedX = -b.speedX;
                    ballGoingLeft = false;
                    ballGoingRight = true;
                    
                    // put the ball at the collision point
                    b.x = playerRightSide + b.radius;

                    // update the horizontal ball bounds
                    ballRightSide = b.x + b.radius;
                    ballLeftSide = b.x - b.radius;
                }
            }

            // check if the ball hit the TOP side of the player
            if (ballBottomSide > playerTopSide && ballGoingDown) {

                // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                if (b.x > playerLeftSide && b.x < playerRightSide) {
                    let segment1 = player.x + (player.width / 5);
                    let segment2 = player.x + (player.width / 5)*2;
                    let segment3 = player.x + (player.width / 5)*3;
                    let segment4 = player.x + (player.width / 5)*4;
                    let segment5 = playerRightSide;
                    let fullSpeedX = ballStartSpeedX;
                    let medSpeedX = fullSpeedX*0.6;
                    let lowSpeedX = fullSpeedX*0.2;

                    // change horiztonal direction by different amount
                    // to simulate a change of angle
                    if (b.x > playerLeftSide  && b.x < segment1) {
                        if (b.speedX > 0) { b.speedX = fullSpeedX; }
                        else if (b.speedX < 0) { b.speedX = -fullSpeedX; }
                    } else if (b.x > segment1 && b.x < segment2) {
                        if (b.speedX > 0) { b.speedX = medSpeedX; }
                        else if (b.speedX < 0) { b.speedX = -medSpeedX; }
                    } else if (b.x > segment2 && b.x < segment3) {
                        if (b.speedX > 0) { b.speedX = lowSpeedX; }
                        else if (b.speedX < 0) { b.speedX = -lowSpeedX; }
                    } else if (b.x > segment3 && b.x < segment4) {
                        if (b.speedX > 0) { b.speedX = medSpeedX; }
                        else if (b.speedX < 0) { b.speedX = -medSpeedX; }
                    } else if (b.x > segment4 && b.x < segment5) {
                        if (b.speedX > 0) { b.speedX = medSpeedX; }
                        else if (b.speedX < 0) { b.speedX = -medSpeedX; }
                    }

                    // change vertical direction
                    b.speedY = -b.speedY;
                    ballGoingDown = false;
                    ballGoingUp = true;
                    
                    // put the ball at the collision point
                    b.y = playerTopSide - b.radius;

                    // update the vertical ball bounds
                    ballTopSide = b.y - b.radius;
                    ballBottomSide = b.y + b.radius;
                }
            
            // otherwise check if the ball hit the BOTTOM side of the player
            } else if (ballTopSide < playerBottomSide && ballGoingUp) {

                // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                if (b.x > playerLeftSide && b.x < playerRightSide) {
                    // change vertical direction
                    b.speedY = -b.speedY;
                    ballGoingUp = false;
                    ballGoingDown = true;
                    
                    // put the ball at the collision point
                    b.y = playerBottomSide + b.radius;

                    // update the vertical ball bounds
                    ballBottomSide = b.y + b.radius;
                    ballTopSide = b.y - b.radius;
                }
            }
        }
    }

    function testCollisionBallWithBlocks(b) {
        blocks.forEach(function(block, index) {
            if(circRectsOverlap(block.x, block.y, block.width, block.height, b.x, b.y, b.radius)) {
                let ballRightSide = b.x + b.radius;
                let ballLeftSide = b.x - b.radius;
                let blockRightSide = block.x + block.width;
                let blockLeftSide = block.x;

                let ballTopSide = b.y - b.radius;
                let ballBottomSide = b.y + b.radius;
                let blockTopSide = block.y;
                let blockBottomSide = block.y + block.height;

                let ballGoingRight = b.speedX > 0;
                let ballGoingLeft = b.speedX < 0;
                let ballGoingUp = b.speedY < 0;
                let ballGoingDown = b.speedY > 0;

                if (sfx) { blockCollisionSound.play(); }

                // check if the ball hit the LEFT side of the block
                if (ballRightSide > blockLeftSide && ballGoingRight) {
                    
                    // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                    if (b.y > blockTopSide && b.y < blockBottomSide) {
                        // change horizontal direction
                        b.speedX = -b.speedX;
                        ballGoingRight = false;
                        ballGoingLeft = true;
                        
                        // put the ball at the collision point
                        b.x = ballLeftSide - b.radius;
                        
                        // update the horizontal ball bounds
                        ballLeftSide = b.x - b.radius;
                        ballRightSide = b.x + b.radius;
                    }
                
                // otherwise check if the ball hit the RIGHT side of the block
                } else if (ballLeftSide < blockRightSide && ballGoingLeft) {
                    
                    // also check if the ball centre is within the TOP & BOTTOM bounds of the block
                    if (b.y > blockTopSide && b.y < blockBottomSide) {
                        // change horizontal direction
                        b.speedX = -b.speedX;
                        ballGoingLeft = false;
                        ballGoingRight = true;
                        
                        // put the ball at the collision point
                        b.x = blockRightSide + b.radius;

                        // update the horizontal ball bounds
                        ballRightSide = b.x + b.radius;
                        ballLeftSide = b.x - b.radius;
                    }
                }
                
                // check if the ball hit the TOP side of the block
                if (ballBottomSide > blockTopSide && ballGoingDown) {

                    // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                    if (b.x > blockLeftSide && b.x < blockRightSide) {
                        // change vertical direction
                        b.speedY = -b.speedY;
                        ballGoingDown = false;
                        ballGoingUp = true;
                        
                        // put the ball at the collision point
                        b.y = blockTopSide - b.radius;

                        // update the vertical ball bounds
                        ballTopSide = b.y - b.radius;
                        ballBottomSide = b.y + b.radius;
                    }
                
                // otherwise check if the ball hit the BOTTOM side of the block
                } else if (ballTopSide < blockBottomSide && ballGoingUp) {

                    // also check if the ball centre is within the LEFT & RIGHT bounds of the block
                    if (b.x > blockLeftSide && b.x < blockRightSide) {
                        // change vertical direction
                        b.speedY = -b.speedY;
                        ballGoingUp = false;
                        ballGoingDown = true;
                        
                        // put the ball at the collision point
                        b.y = blockBottomSide + b.radius;

                        // update the vertical ball bounds
                        ballBottomSide = b.y + b.radius;
                        ballTopSide = b.y - b.radius;
                    }
                }

                // remove the block from the array
                blocks.splice(index, 1);

                // increment the score
                currentScore += 1;
            }
        });
    }

    // UTILITY FUNCTION
    // test collisions between rectangle and circle
    function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
        let testX=cx;
        let testY=cy;
        if (testX < x0) testX=x0; // test left
        if (testX > (x0+w0)) testX=(x0+w0); // test right
        if (testY < y0) testY=y0; // test top
        if (testY > (y0+h0)) testY=(y0+h0); // test bottom
        return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY)) < r*r); // to avoid expensive sqrt calc
    }

    var toggleSFX = function() {
        if (sfx === true) {
            sfx = false;
        } else {
            sfx = true;
        }
    };

    var getSFX = function() {
        return sfx;
    };

    return {
        start: start,
        toggleSFX: toggleSFX,
        getSFX: getSFX
    };
};

window.onload = function init() {
    let startButton = document.querySelector("#startButton");
    let sfxToggleBtn = document.querySelector("#sfxToggleBtn");
    let startDiv = document.querySelector("#startDiv");
    let gameContainer = document.querySelector("#gameContainer");
    let gameCanvas = document.querySelector("#gameCanvas");
    var game = new Guavanoid();

    startButton.addEventListener('click', function(evt) {
        startButton.classList.add("hidden");
        startDiv.classList.add("hidden");
        gameContainer.classList.remove("hidden");
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