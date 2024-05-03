"use strict";

var Guavanoid = function() {
    let canvas, ctx, w, h;
    let winDiv, winSpan, loseDiv, loseSpan, pauseDiv;
    let mousePos;
    let totalScore = 0;
    let level = 1;

    let blocks = [];
    let ball, player;
    let playerStartPosX, playerStartPosY;
    let ballStartPosX, ballStartPosY, ballStartSpeedX, ballStartSpeedY;
    let blockCollisionSound, playerCollisionSound, failCollisionSound;

    let win = false;
    let lose = false;
    let paused = false;

    // for time based animation
    var delta, then;

    class Player {
        x = '';
        y = '';
        width = '';
        height = '';
        color = '';
        lives = 3;

        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }

        draw(ctx) {
            // GOOD practice: save the context, use 2D trasnformations
            ctx.save();

            // translate the coordinate system, draw relative to it
            ctx.translate(this.x, this.y);

            // draw the player with its current color
            ctx.fillStyle = this.color;

            // draw the player at its current position, width and height
            ctx.fillRect(0, 0, this.width, this.height);

            // GOOD practice: restore the context
            ctx.restore();
        }

        move(x) {
            const halfPlayerWidth = this.width / 2;

            if (x < halfPlayerWidth) {
                this.x = x;
            } else if (x > (w - halfPlayerWidth)) {
                this.x = x - this.width;
            } else {
                this.x = x - halfPlayerWidth;
            }
        }
    }

    class Ball {
        x = '';
        y = '';
        radius = '';
        color = '';
        speedX;
        speedY;
        incrementX;
        incrementY;
        isAttached = true;

        constructor(x, y, radius, color, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.speedX = speedX;
            this.speedY = speedY;
        }

        set attached(isAttached) {
            this.isAttached = isAttached;
        }

        set incX(incrementX) {
            this.incrementX = incrementX;
        }

        set incY(incrementY) {
            this.incrementY = incrementY;
        }
        
        draw(ctx) {
            // GOOD practice: save the context, use 2D trasnformations
            ctx.save();
        
            // translate the coordinate system, draw relative to it
            ctx.translate(this.x, this.y);
            
            // draw the ball with its current color
            ctx.fillStyle = this.color;
            
            // draw the ball at its current position
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
            ctx.fill();
        
            // GOOD practice: restore the context
            ctx.restore();    
        }

        move() {
            //this.x += this.speedX;
            this.x += this.incrementX;
            //this.y += this.speedY;
            this.y += this.incrementY;
        }

        followPlayer(x) {
            const halfPlayerWidth = player.width / 2;

            if (x < halfPlayerWidth) {
                this.x = x + halfPlayerWidth;
            } else if (x > (w - halfPlayerWidth)) {
                this.x = x - halfPlayerWidth;
            } else {
                this.x = x;
            }
        }
    }

    class Block {
        x = '';
        y = '';
        width = '';
        height = '';
        color = '';

        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }

        draw(ctx) {
            // GOOD practice: save the context, use 2D trasnformations
            ctx.save();

            // translate the coordinate system, draw relative to it
            ctx.translate(this.x, this.y);

            // draw the player with its current color
            ctx.fillStyle = this.color;

            // draw the player at its current position, width and height
            ctx.fillRect(0, 0, this.width, this.height);

            // GOOD practice: restore the context
            ctx.restore();
        }
    }

    //window.onload = function init() {
    var start = function() {
        let playerWidth = 50;
        let playerHeight = 10;
        let playerColor = 'black';

        let ballRadius = 5;
        let ballColor = 'red';

        let blockRows = 6;
        let blockCols = 10;
        let blockWidth = 60;
        let blockHeight = 20;
        let blockColor = 'grey';

        // get the canvas elements from the page
        canvas = document.querySelector("#gameCanvas");
        winDiv = document.querySelector("#winDiv");
        winSpan = document.querySelector("#winSpan");
        loseDiv = document.querySelector("#loseDiv");
        loseSpan = document.querySelector("#loseSpan");
        pauseDiv = document.querySelector("#pauseDiv");

        // get the width and height of the canvas
        w = canvas.width;
        h = canvas.height;

        playerStartPosX = (w / 2) - (playerWidth / 2);
        playerStartPosY = h - 50;
        
        // create player
        player = new Player(playerStartPosX, playerStartPosY, playerWidth, playerHeight, playerColor);

        ballStartPosX = w / 2;
        ballStartPosY = playerStartPosY - ballRadius;
        //ballStartSpeedX = 5;
        ballStartSpeedX = 300; // 60 fps * 5 px = 300 px/s (time based animation)
        //ballStartSpeedY = -5;
        ballStartSpeedY = -300; // 60 fps * 5 px = 300 px/s (time based animation)

        // create ball
        ball = new Ball(ballStartPosX, ballStartPosY, ballRadius, ballColor, ballStartSpeedX, ballStartSpeedY);

        // create blocks
        blocks = createBlocks(blockRows, blockCols, blockWidth, blockHeight, blockColor);

        // required to draw 2d shapes to the canvas object
        ctx = canvas.getContext("2d");

        // add a mousemove event listener to the canvas to track user mouse movement
        canvas.addEventListener('mousemove', mouseMoved);

        // add a mouseclick event listener to the canvas to move the ball
        canvas.addEventListener('click', processClick);

        // add a keydown event listener to the window to pause the game
        document.addEventListener('keydown', processKeyDown);

        // Load embedded sounds
        blockCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56enp6dnZ2dnJycnJybm5ubmpqampqZmZmZmZiYmJiYl5eXl5eWlpaWlpZxTU1OTk9PT1BQUVFRUlJSU1NUVFRVVVVWVlZXV1dYWFhYWVlZWlpaW1tbW1xcXF1dXV1eXl5fX19fYGBgYGFhYWFiYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqampqampra2tra2u0tLOzsrKysbGwsLCvr66urq2traysq6urqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OioqKioaGhoKCgoJ+EV1dXWFhYWVlZWlpaWltbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmdnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb2+vt7e3tra1tbS0tLOzsrKxsbGwsLCvr66urq2traysq6urqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OioqKPWVlaWlpbW1tbXFxcXV1dXV5eXl5fX19fYGBgYWFhYWFiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpqampqamtra2tra2xsbGxsbGxtbW1tbW1ubm5ubm5ubm9vb29vb29wcHBwcHCnuLi3t7e2trW1tLS0s7OysrKxsbCwsK+vrq6ura2trKysq6uqqqqpqamoqKinp6enpqampaWlpKSkpKOjo6KZWlpaWltbW1xcXFxdXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpampqampra2tra2trbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vcHBwcHBwcHCeubi4t7e2tra1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampaWlpaSkpKOjo6OiWlpaW1tbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbm5ubm5ubm5vb29vb29vcHBwcHBwcHCVubi4t7e3tra1tbS0tLOzsrKxsbGwsLCvr66urq2traysq6urqqqqqampqKiop6enpqampqWlpaSkpKOjo6OiY1paW1tbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmdnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbm5ubm5ubm5vb29vb29vcHBwcHBwcHCMubi4t7e3tra1tbS0tLOzsrKysbGwsLCvr66urq2traysrKurqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OibFpaWltbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vcHBwcHBwcHCDubi4uLe3tra1tbS0tLOzsrKysbGwsLCvr66urq2traysrKurq6qqqampqKioqKenp6ampqWlpaSkpKSjo6OidVpaWltbW1xcXFxdXV1eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmZnZ2doaGhoaWlpaWpqampra2trbGxsbG1tbW1tbm5ubm9vb29vcHBwcHBwcXFxcXFycnJycnJzc3Nzc3NzdHR0dHR0dHV1dXV1dXV8paWlpKSjo6KioaGgoKCfn56enZ2dnJycm5uampqZmZmYmJiXl5eWlpaVlZWUlJSUk5OTkpKSkpGRkZGQkJCQf25vb29vcHBwcHFxcXFxcnJycnNzc3NzdHR0dHR1dXV1dXV2dnZ2dnZ3d3d3d3d4eHh4eHh4eXl5eXl5eXl6enp6enp6enp7e3t7e3t7e3t7fHx8fHx8fHx8fHx9fX19fX19fX19fX19fn5+fn5+fn5+fn5+hISEg4ODg4OCgoKCgoKBgYGBgYCAgICAgIA=']
        });
        playerCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56eVVZWVldXV1hYWFlZWVpaWltbW1tcXFxdXV1dXl5eXl9fX19gYGBgYY6pqamoqKinp6empqalpaWlpKSko6N/WltbW1xcXFxdXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NjZGRkba2trKyrq6uqqqqpqamoqKinp6empqZdXV5eXl9fX19gYGBgYWFhYWJiYmJiY2NjY2RkZGRlZWVlZWZmZmZmlK+urq6tra2srKyrq6qqqqmpqaioqINfX2BgYGBhYWFhYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hxsLCvr6+urq6tra2srKurq6qqqqmpqWBgYWFhYWFiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGiWsbCwsK+vr66ura2trKysq6urqqqqhWFhYWJiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaXKysbGwsLCvr66urq2traysq6urqqqqYWFiYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaZeysbGwsLCvr66urq2traysrKurq6qGYWJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpc7KysbGwsLCvr66urq2traysrKurqqphYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpl7KxsbGwsLCvr66urq2traysq6urqoZiYmJiY2NjY2NkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlzsrKxsbGwsK+vr66ura2trKysq6urqmJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWqXsrKxsbCwsK+vrq6ura2trKysq6urhmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpanOysrGxsbCwr6+vrq6ura2srKyrq6uqYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpapeysrGxsLCwr6+urq6tra2srKyrq6uGYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqc7KysbGxsLCvr6+urq6traysrKurq6piYmJiY2NjY2NkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlql7KysbGwsLCvr6+urq2traysrKurq4ZiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpzsrKxsbGwsK+vr66urq2trKysq6urqmJiYmJjY2NjZGRkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWqXsrKxsbCwsK+vr66ura2trKysq6urhmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpanOysrGxsbCwr6+vrq6ura2srKyrq6uqYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpapeysrGxsLCwr6+vrq6tra2srKyrq6uGYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqc7KysbGxsLCvr6+urq6traysrKurq6piYmJiY2NjY2RkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlql7KysbGwsLCvr6+urq2traysrKurq4ZiYmJjY2NkZGRlZWVlZmZmZ2dnZ2hoaGlpaWlqampqa2tra2xsbGx0rKurqqqpqaiop6empqalpaSko6OiomhoaGhpaWlpampqa2tra2xsbGxsbW1tbW5ubm5ub29vb3BwcHBwcXGPoaGhoKCfn56enp2dnZycm5ubmpqag25ubm5vb29vb3BwcHBxcXFxcXJycnJycnNzc3NzdHR0dHR0dXV1dXmXl5eWlpaVlZWUlJSTk5OTkpKSkZGRdHR0dHR0dXV1dXV2dnZ2dnZ3d3d3d3d3eHh4eHh4eHl5eXl5eXl5eoaNjYyMjIyLi4uLioqKioqJiYmJiIiBenp6enp6ent7e3t7e3t7fHx8fHx8fHx8fX19fX19fX19fX5+fn5+f4ODg4KCgoKCgYGBgYGBgYCAgICAgIA=']
        });
        failCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56enp6dnZ2dnJycnJybm5ubmpqampqZmZmZmZiYmJiYl5eXl5eWlpaWlpaVlZWVlZWUlJSUlJSTk5OTk5OSkpKSkpKSkZGRkZGRkZCQkJCQkJCPj4+Pj4+Pj4+Ojo6Ojo6Ojo2NjY2NjY2NjYyMjIyMjIyMjIyLi4JDQ0RERUVGRkdHSEhISUlKSktLS0xMTU1NTk5PT09QUFFRUVJSUlNTU1RUVVVVVlZWV1dXWFhYWFlZWVpaWltbW1tcXFxdXV1dXl5eX19fX2BgYGBhYWFhYmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpampqampqa2tra2trbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vb3BwcHBwcHBwcXFxcXFxcXFxcnJycnJycnJyc3Nzc3Nzc3Nzc3R0dHR0dHR0dHR0dXV1dXV1dXV1dXV1dnZ2dnZ2dnZ2dnZ2dnd3d3d3d3d3d3d3d3d3eHh4eHicwL+/vr69vby8u7u7urq5ubi4t7e2tra1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampqWlpaSkpKOjo6OioqKhoaGhoKCgoJ+fn5+enp6enZ2dnZycnJycm5ubm5qampqamZmZmZmYmJiYmJeXl5eXlpaWlpaWlZWVlZVwTE1NTU5OT09PUFBRUVFSUlJTU1NUVFVVVVZWVldXV1hYWFhZWVlaWlpbW1tbXFxcXV1dXV5eXl9fX19gYGBgYWFhYWJiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpqampqamtra2tra2xsbGxsbG1tbW1tbW1ubm5ubm5ub29vb29vb29wcHBwcHBwcHFxcXFxcXFxcXJycnJycnJycnNzc3Nzc3Nzc3N0dHR0dHR0dHR0dHV1dXV1dXV1dXV1dXZ2dnZ2dnZ2dnZ2dnZ3d3d3d3d3d3d3d3d3d3d4eHh4eHh4eHh4eHh4eHh4eXl5eXl5eXl5uMHAwL+/vr69vby8u7u6urq5ubi4t7e2trW1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampaWlpaSkpKOjo6OioqKhoaGhoKCgoJ+fn5+enp6enZ2dnZycnJycm5ubm5qampqamZmZmZmYmJiYmJeXl5eXlpaWlpaWlZWVVU1NTk5OT09QUFBRUVFSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVlaWlpbW1tcXFxcXV1dXl5eXl9fX19gYGBgYWFhYWJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWpqampqamtra2tra2xsbGxsbG1tbW1tbW1ubm5ubm5ub29vb29vb29wcHBwcHBwcHFxcXFxcXFxcnJycnJycnJycnNzc3Nzc3Nzc3N0dHR0dHR0dHR0dXV1dXV1dXV1dXV1dnZ2dnZ2dnZ2dnZ2dnZ3d3d3d3d3d3d3d3d3d3h4eHh4eHh4eHh4eHh4eHh4eXl5eXl5eXl5i8HBwMC/v76+vb28vLu7urq5ubi4uLe3tra1tbW0tLOzsrKysbGwsLCvr6+urq2traysrKurq6qqqqmpqaioqKenp6ampqWlpaSkpKSjo6OioqKioaGhoaCgoKCfn5+fnp6enp2dnZ2cnJycm5ubm5uampqampmZmZmYmJiYmJiXl5eXl5aWlpaWlZWVg01OTk9PUFFRUlJTU1RUVVVWVldXV1hYWVlaWltbW1xcXV1dXl5fX19gYGBhYWJiYmNjY2RkZGVlZWZmZmZnZ2doaGhpaWlpampqamtra2tsbGxsbW1tbW5ubm5ub29vb29wcHBwcHFxcXFxcnJycnJyc3Nzc3NzdHR0dHR0dXV1dXV1dXZ2dnZ2dnZ2d3d3d3d3d3d4eHh4eHh4eHh5eXl5eXl5eXl5eXp6enp6enp6enp6e3t7e3t7e3t7e3t7e3t8fHx8fHx8fHx8fHx8fHx8fX19fX19fX19fX19fX19fX19fX19fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+foaJiYmJiIiIiIeHh4aGhoaGhYWFhYSEhISEg4ODg4OCgoKCgoGBgYGBgYCAgICAgIA=']
        });

        // start the animation
        mainLoop();
    }

    //function mainLoop() {
    function mainLoop(now) {
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
            displayHUD(level, totalScore, player.lives);

            if (!ball.isAttached) {
                moveBall(ball);
            }

            // make the player follow the mouse
            // test if the mouse is positioned over the canvas first
            if(mousePos !== undefined) {
                //player.move(mousePos.x, mousePos.y);
                player.move(mousePos.x);
                if (ball.isAttached) {
                    ball.followPlayer(mousePos.x);
                }
            }
        }

        if (!checkWinCondition() && !checkLoseCondition()) {
            // copy the current time to the old time
            then = now;
            // ask for a new animation frame
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

    function createBlocks(rows, cols, width, height, color) {
        let blockArray = [];
        let blockGap = 3;
        
        for (let r=0; r < rows; r++) {
            let blockY;
            let blockYSpacing = height + blockGap;
            let topGapY = 50;

            if (r === 0) {
                blockY = topGapY; 
            } else {
                blockY = topGapY + r*blockYSpacing;
            }

            for (let c=0; c < cols; c++) {
                let blockX;
                let blockXSpacing = width + blockGap;
                let leftGapX = (w - blockXSpacing*cols) / 2;

                if (c === 0) {
                    blockX = leftGapX;
                } else {
                    blockX = leftGapX + c*blockXSpacing;
                }

                let b = new Block(blockX, blockY, width, height, color);
                blockArray.push(b);
            }
        }

        // returns the array of blocks
        return blockArray;
    }

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
            win = true;

            // display win screen
            canvas.classList.add("hidden");
            winDiv.classList.remove("hidden");
            winSpan.textContent = "Score: " + totalScore;
        }

        return win;
    }

    function checkLoseCondition() {
        if (player.lives < 0) {
            lose = true;

            // display lose screen
            canvas.classList.add("hidden");
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

            failCollisionSound.play();
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

            playerCollisionSound.play();

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

                blockCollisionSound.play();

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
                totalScore += 1;
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

    return {
        start: start
    };
}

window.onload = function init() {
    let startButton = document.querySelector("#startButton");
    let startDiv = document.querySelector("#startDiv");
    let gameCanvas = document.querySelector("#gameCanvas");

    startButton.addEventListener('click', function(evt) {
        startButton.classList.add("hidden");
        startDiv.classList.add("hidden");
        gameCanvas.classList.remove("hidden");
        
        var game = new Guavanoid();
        game.start();
    });
}