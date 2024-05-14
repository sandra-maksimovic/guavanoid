"use strict";

var game, gameCanvas, gameContainerDiv;

var Game = function() {    
    let canvas = {
        ctx: gameCanvas.getContext("2d"),
        h: gameCanvas.height,
        w: gameCanvas.width
    };

    let audio = {
        blockCollisionSound: undefined,
        failCollisionSound: undefined,
        pickupCollisionSound: undefined,
        playerCollisionSound: undefined,
        sfx: true
    };

    let ball;

    let ballInit = {
        ballColor: 'red',
        ballRadius: 5,
        ballStartPosX: canvas.w / 2,
        ballStartPosY: undefined, // set later in start(), requires ballInit.ballRadius value for init
        ballStartSpeedX: 300, // 60 fps * 5 px = 300 px/s
        ballStartSpeedY: -300 // 60 fps * 5 px = 300 px/s
    };

    let blocks = [];

    let gameState = {
        currentLevel: 1,
        currentScore: 0,
        displayTitle: true,
        displayTitleStartTime: 0,
        displayTitleTimer: 1500, //ms
        hasWall: false,
        lose: false,
        paused: false,
        pauseListener: false,
        totalLevels: 5,
        totalScore: 0,
        win: false
    };

    let htmlElements = {
        loseDiv: document.querySelector("#loseDiv"),
        loseSpan: document.querySelector("#loseSpan"),
        pauseDiv: document.querySelector("#pauseDiv"),
        winDiv: document.querySelector("#winDiv"),
        winSpan: document.querySelector("#winSpan")
    };

    // i.e. mousePos.x
    let inputState = {};

    let player;

    let playerInit = {
        playerColor: 'black',
        playerHeight: 10,
        playerWidth: 50,
        playerStartPosX: undefined, // set later in start(), requires playerInit.playerWidth value for init
        playerStartPosY: canvas.h - 50
    };

    let spawned = {
        numPickups: 3,
        pickupArray: []
    };

    let wall;

    let wallInit = {
        wallColor: undefined,
        wallHeight: undefined,
        wallWidth: undefined,
        wallX: undefined,
        wallY: undefined
    };
    
    var loadAssets = function(callback) {
        // load embedded sounds
        audio.blockCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56enp6dnZ2dnJycnJybm5ubmpqampqZmZmZmZiYmJiYl5eXl5eWlpaWlpZxTU1OTk9PT1BQUVFRUlJSU1NUVFRVVVVWVlZXV1dYWFhYWVlZWlpaW1tbW1xcXF1dXV1eXl5fX19fYGBgYGFhYWFiYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqampqampra2tra2u0tLOzsrKysbGwsLCvr66urq2traysq6urqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OioqKioaGhoKCgoJ+EV1dXWFhYWVlZWlpaWltbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmdnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb2+vt7e3tra1tbS0tLOzsrKxsbGwsLCvr66urq2traysq6urqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OioqKPWVlaWlpbW1tbXFxcXV1dXV5eXl5fX19fYGBgYWFhYWFiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpqampqamtra2tra2xsbGxsbGxtbW1tbW1ubm5ubm5ubm9vb29vb29wcHBwcHCnuLi3t7e2trW1tLS0s7OysrKxsbCwsK+vrq6ura2trKysq6uqqqqpqamoqKinp6enpqampaWlpKSkpKOjo6KZWlpaWltbW1xcXFxdXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpampqampra2tra2trbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vcHBwcHBwcHCeubi4t7e2tra1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampaWlpaSkpKOjo6OiWlpaW1tbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbm5ubm5ubm5vb29vb29vcHBwcHBwcHCVubi4t7e3tra1tbS0tLOzsrKxsbGwsLCvr66urq2traysq6urqqqqqampqKiop6enpqampqWlpaSkpKOjo6OiY1paW1tbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmdnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbm5ubm5ubm5vb29vb29vcHBwcHBwcHCMubi4t7e3tra1tbS0tLOzsrKysbGwsLCvr66urq2traysrKurqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OibFpaWltbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vcHBwcHBwcHCDubi4uLe3tra1tbS0tLOzsrKysbGwsLCvr66urq2traysrKurq6qqqampqKioqKenp6ampqWlpaSkpKSjo6OidVpaWltbW1xcXFxdXV1eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmZnZ2doaGhoaWlpaWpqampra2trbGxsbG1tbW1tbm5ubm9vb29vcHBwcHBwcXFxcXFycnJycnJzc3Nzc3NzdHR0dHR0dHV1dXV1dXV8paWlpKSjo6KioaGgoKCfn56enZ2dnJycm5uampqZmZmYmJiXl5eWlpaVlZWUlJSUk5OTkpKSkpGRkZGQkJCQf25vb29vcHBwcHFxcXFxcnJycnNzc3NzdHR0dHR1dXV1dXV2dnZ2dnZ3d3d3d3d4eHh4eHh4eXl5eXl5eXl6enp6enp6enp7e3t7e3t7e3t7fHx8fHx8fHx8fHx9fX19fX19fX19fX19fn5+fn5+fn5+fn5+hISEg4ODg4OCgoKCgoKBgYGBgYCAgICAgIA=']
        });
        audio.failCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56enp6dnZ2dnJycnJybm5ubmpqampqZmZmZmZiYmJiYl5eXl5eWlpaWlpaVlZWVlZWUlJSUlJSTk5OTk5OSkpKSkpKSkZGRkZGRkZCQkJCQkJCPj4+Pj4+Pj4+Ojo6Ojo6Ojo2NjY2NjY2NjYyMjIyMjIyMjIyLi4JDQ0RERUVGRkdHSEhISUlKSktLS0xMTU1NTk5PT09QUFFRUVJSUlNTU1RUVVVVVlZWV1dXWFhYWFlZWVpaWltbW1tcXFxdXV1dXl5eX19fX2BgYGBhYWFhYmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpampqampqa2tra2trbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vb3BwcHBwcHBwcXFxcXFxcXFxcnJycnJycnJyc3Nzc3Nzc3Nzc3R0dHR0dHR0dHR0dXV1dXV1dXV1dXV1dnZ2dnZ2dnZ2dnZ2dnd3d3d3d3d3d3d3d3d3eHh4eHicwL+/vr69vby8u7u7urq5ubi4t7e2tra1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampqWlpaSkpKOjo6OioqKhoaGhoKCgoJ+fn5+enp6enZ2dnZycnJycm5ubm5qampqamZmZmZmYmJiYmJeXl5eXlpaWlpaWlZWVlZVwTE1NTU5OT09PUFBRUVFSUlJTU1NUVFVVVVZWVldXV1hYWFhZWVlaWlpbW1tbXFxcXV1dXV5eXl9fX19gYGBgYWFhYWJiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpqampqamtra2tra2xsbGxsbG1tbW1tbW1ubm5ubm5ub29vb29vb29wcHBwcHBwcHFxcXFxcXFxcXJycnJycnJycnNzc3Nzc3Nzc3N0dHR0dHR0dHR0dHV1dXV1dXV1dXV1dXZ2dnZ2dnZ2dnZ2dnZ3d3d3d3d3d3d3d3d3d3d4eHh4eHh4eHh4eHh4eHh4eXl5eXl5eXl5uMHAwL+/vr69vby8u7u6urq5ubi4t7e2trW1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampaWlpaSkpKOjo6OioqKhoaGhoKCgoJ+fn5+enp6enZ2dnZycnJycm5ubm5qampqamZmZmZmYmJiYmJeXl5eXlpaWlpaWlZWVVU1NTk5OT09QUFBRUVFSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVlaWlpbW1tcXFxcXV1dXl5eXl9fX19gYGBgYWFhYWJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWpqampqamtra2tra2xsbGxsbG1tbW1tbW1ubm5ubm5ub29vb29vb29wcHBwcHBwcHFxcXFxcXFxcnJycnJycnJycnNzc3Nzc3Nzc3N0dHR0dHR0dHR0dXV1dXV1dXV1dXV1dnZ2dnZ2dnZ2dnZ2dnZ3d3d3d3d3d3d3d3d3d3h4eHh4eHh4eHh4eHh4eHh4eXl5eXl5eXl5i8HBwMC/v76+vb28vLu7urq5ubi4uLe3tra1tbW0tLOzsrKysbGwsLCvr6+urq2traysrKurq6qqqqmpqaioqKenp6ampqWlpaSkpKSjo6OioqKioaGhoaCgoKCfn5+fnp6enp2dnZ2cnJycm5ubm5uampqampmZmZmYmJiYmJiXl5eXl5aWlpaWlZWVg01OTk9PUFFRUlJTU1RUVVVWVldXV1hYWVlaWltbW1xcXV1dXl5fX19gYGBhYWJiYmNjY2RkZGVlZWZmZmZnZ2doaGhpaWlpampqamtra2tsbGxsbW1tbW5ubm5ub29vb29wcHBwcHFxcXFxcnJycnJyc3Nzc3NzdHR0dHR0dXV1dXV1dXZ2dnZ2dnZ2d3d3d3d3d3d4eHh4eHh4eHh5eXl5eXl5eXl5eXp6enp6enp6enp6e3t7e3t7e3t7e3t7e3t8fHx8fHx8fHx8fHx8fHx8fX19fX19fX19fX19fX19fX19fX19fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+foaJiYmJiIiIiIeHh4aGhoaGhYWFhYSEhISEg4ODg4OCgoKCgoGBgYGBgYCAgICAgIA=']
        });
        audio.pickupCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRmgIAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YUQIAAAIEBgfJy42PURMU1piaXB3foWMk5qhqK61vMLJ0Nbd4+nu6eLb1M3GwLmyq6WemJGLhH54cWtlX1lTTUdBOzUvKSMeHSQqMDY8Q0lPVVthZmxyeH6DiY+Ump+lqq+1ur/Eyc/U2NTPycS+ubOuqKOemZOOiYR/enVwa2ZiXVhUT0pGQT04NDM4PEFGS1BVWV5jZ2xwdXl+goaLj5OXnKCkqa2xtrq+wsbEwLy3s6+qpqKemZWRjIiEgHt3c29qZmJeWVVRTUlEQDw6PkJGSk9TV1tgZGhscHV5fYGFio6Slpqeo6err7O3u8DEw766trKuqaWhnZmVkYyIhIB8eHRwbGdjX1tXU09LR0M/PD9ESExQVFhcYGRobHB1eX2BhYmNkZWZnaGlqa2xtbm9wcG9ubWxrKikoJyYlJCMiYWBfXl1cW1pZWFdWVVRTUlGQj9BRUlNUVVZXWFlaW1xdHh8gISIjJCUl5ufo6err7K2ur6/u7ezr6unpKCcmJSQjImFgX15dnJuamZjX1tXVFBMSERBQ0dLT1JWWl5iZWltcXR4fICDh4uPkpaanaGlqaywtLe7vbm1sq6qpqOfm5iUkIyJhYF+enZzb2toZGFdWVZSTktHREVJTFBUV1tfYmZqbXF0eHx/g4aKjpGVmJyfo6aqrrG1uLq3tLCsqaWinpuXk5CMiYWCfnt3dHBtaWZiX1tYVFFNSkdHS05SVVlcYGNnam1xdHh7f4KGiY2Qk5eanqGkqKuvsrW4tbKuq6ikoZ2alpOQjImFgn97eHVxbmtnZGFdWldTUE1JSUxQU1ZaXWFkZ2tucXR4e36ChYiMj5KVmZyfoqaprK+ztbOwrammo6CcmZaTj4yJhoJ/fHl2cm9saWZiX1xZVlJPTEtOUVVYW15hZWhrbnF1eHt+gYSHi46RlJeanaCkp6qtsLOxrquopaKfm5iVko+MiYaDgHx5dnNwbWpnZGFeW1hVUk9NUFNWWVxfY2ZpbG9ydXh7foGEh4qNkJOWmZyfoaSnqq2wr6yppqOgnZqYlZKPjImGg4B9end0cW5saWZjYF1aV1VSUFJVWFteYWRmaWxvcnV4e32Ag4aJjI+RlJeanZ+ipairra2qqKWin5yZl5SRjouJhoOAfXt4dXJwbWpnZWJfXFpXVFJUV1pcX2JlZ2ptcHJ1eHt9gIOFiIuNkJOVmJudoKOlqKurqaajoJ6bmJaTkI6LiIaDgX57eXZzcW5saWZkYV9cWldVVllbXmFjZmhrbnBzdXh6fYCChYeKjI+RlJaZm56go6Woqaekop+cmpeVkpCNi4iGg4F+fHl3dHJvbWtoZmNhXlxaV1hbXWBiZWdpbG5xc3Z4en1/goSHiYuOkJKVl5qcnqGjpaeloqCdm5mWlJGPjYqIhoOBf3x6eHVzcW5samhlY2FeXFpaXV9hZGZoam1vcXR2eHp9f4GEhoiKjY+Rk5WYmpyeoKOko6CenJqXlZORjoyKiIaDgX99e3h2dHJwbmxpZ2VjYV9dXF9hY2VnaWxucHJ0dnh7fX+Bg4WHiYuNkJKUlpianJ6goqCenJqYlpSSkI6MioeFg4F/fXt5d3VzcW9ta2lnZWNhX19hY2VnaWttb3FzdXd5e31/gYOEhoiKjI6QkpSWmJqcnZ+enJqZl5WTkY+Ni4mHhYOBgH58enh2dHJxb21raWdmZGJhY2VmaGpsbnByc3V3eXt9foCChIaHiYuNj5CSlJaXmZudnJqZl5WTkZCOjIqJh4WDgYB+fHt5d3V0cnBvbWtpaGZkY2VmaGpsbW9xcnR2eHl7fX6AgoOFh4iKjI2PkJKUlZeYmpqYl5WTkpCOjYuKiIaFg4KAfn17enh2dXNycG9tbGpoZ2ZnaGpsbW9wcnN1d3h6e31+gIGDhIaHiYqMjY+QkpOVlpiYlpWTkpCPjYyKiYeGhIOCgH99fHp5d3Z1c3Jwb25sa2loaWpsbW9wcnN0dnd5ent9foCBgoSFhoiJioyNjpCRkpSVlZSTkZCPjYyLiYiHhYSDgYB/fnx7enh3dnVzcnFwbm1sa2ttbm9wcnN0dXd4eXp8fX5/gYKDhIWHiImKi42Oj5CRkpOSkZCOjYyLioiHhoWEg4GAf359fHt5eHd2dXRzcnFvbm1tb3BxcnN0dXd4eXp7fH1+f4CBgoSFhoeIiYqLjI2Oj5CRkI+OjYyLioiHhoWEg4KBgH9+fXx7enl4d3Z1dXRzcnFwcHFyc3R1dnd4eXp6e3x9fn+AgYKDhIWGhoeIiYqLjI2Njo6NjIuKiYiHhoWFhIOCgYB/f359fHt6enl4d3Z1dXRzcnJzdHV1dnd4eXp6e3x9fn5/gIGBgoOEhYWGh4eIiYqKi4yLi4qJiIiHhoWFhIOCgoGAgH9+fX18e3t6eXl4d3d2dXV0dXZ3d3h5eXp7e3x9fX5+f4CAgYKCg4OEhYWGhoeIiImJiYiIh4eGhYWEhIOCgoGBgIB/fn59fXx8e3t6enl5eHh3d3d4eHl6ent7fHx9fX5+f3+AgIGBgoKCg4OEhIWFhoaGh4eGhoWFhISDg4OCgoGBgICAf39+fn59fXx8fHt7e3p6enl6enp7e3x8fH19fX5+f39/gICAgYGBgYKCgoODg4SEhISEhISDg4OCgoKCgYGBgICAgH9/f39+fn5+fX19fX18fHx8fHx8fX19fX5+fn5/f39/f4CAgICAgIGBgYGBgYGCgoKCgoKCgYGBgYGBgICAgICAgIB/f39/f39/f39/f35+fn5+fn5+f39/f39/f39/f39/f39/gICAgICAgICAgICAgICAgICA']
        });
        audio.playerCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56eVVZWVldXV1hYWFlZWVpaWltbW1tcXFxdXV1dXl5eXl9fX19gYGBgYY6pqamoqKinp6empqalpaWlpKSko6N/WltbW1xcXFxdXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NjZGRkba2trKyrq6uqqqqpqamoqKinp6empqZdXV5eXl9fX19gYGBgYWFhYWJiYmJiY2NjY2RkZGRlZWVlZWZmZmZmlK+urq6tra2srKyrq6qqqqmpqaioqINfX2BgYGBhYWFhYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hxsLCvr6+urq6tra2srKurq6qqqqmpqWBgYWFhYWFiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGiWsbCwsK+vr66ura2trKysq6urqqqqhWFhYWJiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaXKysbGwsLCvr66urq2traysq6urqqqqYWFiYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaZeysbGwsLCvr66urq2traysrKurq6qGYWJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpc7KysbGwsLCvr66urq2traysrKurqqphYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpl7KxsbGwsLCvr66urq2traysq6urqoZiYmJiY2NjY2NkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlzsrKxsbGwsK+vr66ura2trKysq6urqmJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWqXsrKxsbCwsK+vrq6ura2trKysq6urhmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpanOysrGxsbCwr6+vrq6ura2srKyrq6uqYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpapeysrGxsLCwr6+urq6tra2srKyrq6uGYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqc7KysbGxsLCvr6+urq6traysrKurq6piYmJiY2NjY2NkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlql7KysbGwsLCvr6+urq2traysrKurq4ZiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpzsrKxsbGwsK+vr66urq2trKysq6urqmJiYmJjY2NjZGRkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWqXsrKxsbCwsK+vr66ura2trKysq6urhmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpanOysrGxsbCwr6+vrq6ura2srKyrq6uqYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpapeysrGxsLCwr6+vrq6tra2srKyrq6uGYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqc7KysbGxsLCvr6+urq6traysrKurq6piYmJiY2NjY2RkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlql7KysbGwsLCvr6+urq2traysrKurq4ZiYmJjY2NkZGRlZWVlZmZmZ2dnZ2hoaGlpaWlqampqa2tra2xsbGx0rKurqqqpqaiop6empqalpaSko6OiomhoaGhpaWlpampqa2tra2xsbGxsbW1tbW5ubm5ub29vb3BwcHBwcXGPoaGhoKCfn56enp2dnZycm5ubmpqag25ubm5vb29vb3BwcHBxcXFxcXJycnJycnNzc3NzdHR0dHR0dXV1dXmXl5eWlpaVlZWUlJSTk5OTkpKSkZGRdHR0dHR0dXV1dXV2dnZ2dnZ3d3d3d3d3eHh4eHh4eHl5eXl5eXl5eoaNjYyMjIyLi4uLioqKioqJiYmJiIiBenp6enp6ent7e3t7e3t7fHx8fHx8fHx8fX19fX19fX19fX5+fn5+f4ODg4KCgoKCgYGBgYGBgYCAgICAgIA=']
        });
        
        // call the callback function passed as a parameter, 
        // we're done with loading assets
        callback();
    };

    var start = function() {
        // reset game state
        gameState.currentScore = 0;
        gameState.pauseListener = false;
        gameState.hasWall = false;
        spawned.pickupArray = [];

        // create player
        playerInit.playerStartPosX = (canvas.w / 2) - (playerInit.playerWidth / 2);
        player = new Player(playerInit.playerStartPosX, playerInit.playerStartPosY, playerInit.playerWidth, playerInit.playerHeight, playerInit.playerColor);

        // create ball
        ballInit.ballStartPosY = playerInit.playerStartPosY - ballInit.ballRadius;
        ball = new Ball(ballInit.ballStartPosX, ballInit.ballStartPosY, ballInit.ballRadius, ballInit.ballColor, ballInit.ballStartSpeedX, ballInit.ballStartSpeedY);

        // flag which levels have walls
        if (gameState.currentLevel === 3 || gameState.currentLevel === 5) { gameState.hasWall = true; }

        // create vertical wall
        if (gameState.hasWall === true) {
            wallInit.wallColor = 'black';
            wallInit.wallHeight = (canvas.h / 2);
            wallInit.wallWidth = 10;
            wallInit.wallX = (canvas.w / 2) - (wallInit.wallWidth / 2);
            wallInit.wallY = 50;
            wall = new Wall(wallInit.wallX, wallInit.wallY, wallInit.wallWidth, wallInit.wallHeight, wallInit.wallColor);
        }

        // create blocks
        blocks = createBlocks();

        // add event listeners
        addMouseListeners(gameCanvas, ball, inputState);
        addTestListener(blocks);

        // load assets, then when this is done, start the mainLoop
        loadAssets(function() {
            // we enter here only when all assets have been loaded
            gameState.displayTitle = true;
            gameState.displayTitleStartTime = performance.now();
            // start the game
            mainLoop();
        });
    };

    function mainLoop(now) {
        // check whether the title screen has finished
        if (now - gameState.displayTitleStartTime > gameState.displayTitleTimer) {
            gameState.displayTitle = false;
            
            // add the pause listener during gameplay
            if (!gameState.pauseListener) {
                addPauseListener(gameState, htmlElements);
                gameState.pauseListener = true;
            }

            // main gameplay loop
            if (!gameState.paused) {
                // get the time between frames
                delta = now - then;

                ball.incrementX = calcIncrement(ball.speedX, delta);
                ball.incrementY = calcIncrement(ball.speedY, delta);

                // clear the canvas
                canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
                
                player.draw(canvas.ctx);
                ball.draw(canvas.ctx);
                if (gameState.hasWall === true) {
                    wall.draw(canvas.ctx);
                }
                if (spawned.pickupArray.length > 0) {
                    spawned.pickupArray.forEach((pickup, index) => {
                        pickup.draw(canvas.ctx);
                        pickup.incrementY = calcIncrement(pickup.speedY, delta);
                        movePickup(pickup, index);
                    })
                }

                drawAllBlocks(blocks);
                displayHUD(gameState.currentLevel, gameState.currentScore, player.lives);

                if (!ball.isAttached) {
                    moveBall(ball);
                }

                // make the player follow the mouse
                // test if the mouse is positioned over the canvas first
                if(inputState.mousePos !== undefined) {
                    //player.move(mousePos.x, mousePos.y);
                    player.move(inputState.mousePos.x, canvas.w);
                    if (ball.isAttached) {
                        ball.followPlayer(inputState.mousePos.x, player, canvas.w);
                        // make sure the ball always travels upwards on reset
                        ball.speedY = -Math.abs(ball.speedY);
                    }
                }
            }
    
            // if the game is still going ask for a new frame
            if (!checkWinCondition() && !checkLoseCondition()) {
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

    function displayHUD(lvl, score, lives) {
        let hudXLeftAlign = 40;
        let hudXCenterAlign = canvas.w / 2;
        let huxXRightAlign = canvas.w - 40;
        let hudYTopAlign = 5;

        canvas.ctx.font = "10px sans-serif";
        canvas.ctx.textBaseline = "top";
        canvas.ctx.textAlign = "left";
        canvas.ctx.fillText(`Level: ${lvl}`, hudXLeftAlign, hudYTopAlign);
        canvas.ctx.textAlign = "center";
        canvas.ctx.fillText(`Score: ${score}`, hudXCenterAlign, hudYTopAlign);
        canvas.ctx.textAlign = "right";
        canvas.ctx.fillText(`Lives: ${lives}`, huxXRightAlign, hudYTopAlign);
    }
    
    function displayTitleScreen() {
        const titleX = canvas.w / 2;
        const titleY = canvas.h / 2;

        // remove the pause listener during the title screen
        removePauseListener(gameCanvas);
        gameState.pauseListener = false;

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.font = "bold 100px sans-serif";
        canvas.ctx.textAlign = "center";
        canvas.ctx.textBaseline = "middle";
        canvas.ctx.fillText(`Level ${gameState.currentLevel}`, titleX, titleY);
    }

    function createBlocks() {
        let blockArray = [];
        let blockGap = 3;
        let blockWidth = 60;
        let blockHeight = 20;

        if (gameState.currentLevel === 1) {
            blockArray = createLevel1Layout(blockArray, blockGap, blockWidth, blockHeight, canvas, spawned);
        } else if (gameState.currentLevel === 2) {
            blockArray = createLevel2Layout(blockArray, blockGap, blockWidth, blockHeight, canvas, spawned);
        } else if (gameState.currentLevel === 3) {
            blockArray = createLevel3Layout(blockArray, blockGap, blockWidth, blockHeight, wall, spawned);
        } else if (gameState.currentLevel === 4) {
            blockArray = createLevel4Layout(blockArray, blockGap, blockWidth, blockHeight, canvas, spawned);
        } else if (gameState.currentLevel === 5) {
            blockArray = createLevel5Layout(blockArray, blockGap, blockWidth, blockHeight, wall, spawned);
        }

        return blockArray;
    }

    function drawAllBlocks(blockArray) {
        blockArray.forEach(function(b) {
            b.draw(canvas.ctx);
        });
    }

    function moveBall(b) {
        b.move();    
        testCollisionBallWithWalls(b, audio, canvas);
        testCollisionBallWithPlayer(b, audio, player, ballInit);
        testCollisionBallWithBlocks(b, audio, blocks, gameState, spawned);
        if (gameState.hasWall === true) { testCollisionBallWithInnerWalls(b, wall); }
    }

    function movePickup(p, index) {
        p.move();
        testCollisionPickupWithFloor(p, spawned.pickupArray, index, canvas);
        testCollisionPickupWithPlayer(p, spawned.pickupArray, index, audio, player);
    }

    var checkWinCondition = function() {
        if (blocks.length === 0) {
            gameState.totalScore += gameState.currentScore;

            // we've won so remove all listeners
            removeMouseListeners(gameCanvas);
            removePauseListener();
            removeTestListener();

            if (gameState.currentLevel === gameState.totalLevels) {
                gameState.win = true;

                // display win screen
                gameCanvas.classList.add("hidden");
                gameContainerDiv.classList.add("hidden");
                htmlElements.winDiv.classList.remove("hidden");
                htmlElements.winSpan.textContent = "Score: " + gameState.totalScore;
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

            // we've lost so remove all listeners
            removeMouseListeners(gameCanvas);
            removePauseListener();
            removeTestListener();

            // display lose screen
            gameCanvas.classList.add("hidden");
            gameContainerDiv.classList.add("hidden");
            htmlElements.loseDiv.classList.remove("hidden");
            htmlElements.loseSpan.textContent = "Score: " + gameState.totalScore;
        }

        return gameState.lose;
    }

    var playerFail = function() {
        player.lives -= 1;
        ball.isAttached = true;
        ball.x = ballInit.ballStartPosX;
        ball.y = ballInit.ballStartPosY;
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
    game = new Game();

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