"use strict";

var game, gameCanvas;

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

    let blockColor = [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'indigo',
        'violet'
    ];

    let breakableBlockColor = [
        'white',
        'darkgray',
        'dimgray'
    ];

    let button = {
        isHovering: false,
        sfxToggleBtn: undefined
    };

    let gameState = {
        currentLevel: 1,
        currentScore: 0,
        displayTitle: true,
        displayTitleTimer: 1500, //ms
        displayTitleTimerStartTime: 0,
        hasWall: false,
        paused: false,
        pauseListener: false,
        pickupGrowthTimer: 10000, //ms
        pickupGrowthTimerStartTime: 0,
        totalLevels: 5,
        totalScore: 0
    };

    let handler = {
        buttonClickHandler: undefined,
        buttonHoverHandler: undefined,
        buttonIsHovering: false,
        clearBlocksHandler: undefined,
        detachBallHandler: undefined,
        fireProjectileHandler: undefined,
        mouseMovedHandler: undefined,
        pauseGameHandler: undefined
    };

    let htmlElements = {
        pauseDiv: document.querySelector("#pauseDiv")
    };

    let icon = {
        sfxOff: undefined,
        sfxOn: undefined
    };

    // i.e. mousePos.x
    let inputState = {};

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

    let spawn = {
        numPickups: 3,
        pickupArray: [],
        pickupTypeArray: [
            { type: 'growth', color: 'magenta' },
            { type: 'health', color: 'lime' },
            { type: 'laser', color: 'orange' }
        ],
        numProjectiles: 3,
        projectileArray: [],
        //projectile: {}
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
    
    var loadAssets = function(callback) {
        // load embedded sounds
        audio.blockCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56enp6dnZ2dnJycnJybm5ubmpqampqZmZmZmZiYmJiYl5eXl5eWlpaWlpZxTU1OTk9PT1BQUVFRUlJSU1NUVFRVVVVWVlZXV1dYWFhYWVlZWlpaW1tbW1xcXF1dXV1eXl5fX19fYGBgYGFhYWFiYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqampqampra2tra2u0tLOzsrKysbGwsLCvr66urq2traysq6urqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OioqKioaGhoKCgoJ+EV1dXWFhYWVlZWlpaWltbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmdnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb2+vt7e3tra1tbS0tLOzsrKxsbGwsLCvr66urq2traysq6urqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OioqKPWVlaWlpbW1tbXFxcXV1dXV5eXl5fX19fYGBgYWFhYWFiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpqampqamtra2tra2xsbGxsbGxtbW1tbW1ubm5ubm5ubm9vb29vb29wcHBwcHCnuLi3t7e2trW1tLS0s7OysrKxsbCwsK+vrq6ura2trKysq6uqqqqpqamoqKinp6enpqampaWlpKSkpKOjo6KZWlpaWltbW1xcXFxdXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpampqampra2tra2trbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vcHBwcHBwcHCeubi4t7e2tra1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampaWlpaSkpKOjo6OiWlpaW1tbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbm5ubm5ubm5vb29vb29vcHBwcHBwcHCVubi4t7e3tra1tbS0tLOzsrKxsbGwsLCvr66urq2traysq6urqqqqqampqKiop6enpqampqWlpaSkpKOjo6OiY1paW1tbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmdnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbm5ubm5ubm5vb29vb29vcHBwcHBwcHCMubi4t7e3tra1tbS0tLOzsrKysbGwsLCvr66urq2traysrKurqqqqqampqKiop6enp6ampqWlpaSkpKSjo6OibFpaWltbW1xcXF1dXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlqampqampra2tra2tsbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vcHBwcHBwcHCDubi4uLe3tra1tbS0tLOzsrKysbGwsLCvr66urq2traysrKurq6qqqampqKioqKenp6ampqWlpaSkpKSjo6OidVpaWltbW1xcXFxdXV1eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmZnZ2doaGhoaWlpaWpqampra2trbGxsbG1tbW1tbm5ubm9vb29vcHBwcHBwcXFxcXFycnJycnJzc3Nzc3NzdHR0dHR0dHV1dXV1dXV8paWlpKSjo6KioaGgoKCfn56enZ2dnJycm5uampqZmZmYmJiXl5eWlpaVlZWUlJSUk5OTkpKSkpGRkZGQkJCQf25vb29vcHBwcHFxcXFxcnJycnNzc3NzdHR0dHR1dXV1dXV2dnZ2dnZ3d3d3d3d4eHh4eHh4eXl5eXl5eXl6enp6enp6enp7e3t7e3t7e3t7fHx8fHx8fHx8fHx9fX19fX19fX19fX19fn5+fn5+fn5+fn5+hISEg4ODg4OCgoKCgoKBgYGBgYCAgICAgIA=']
        });
        audio.failCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56enp6dnZ2dnJycnJybm5ubmpqampqZmZmZmZiYmJiYl5eXl5eWlpaWlpaVlZWVlZWUlJSUlJSTk5OTk5OSkpKSkpKSkZGRkZGRkZCQkJCQkJCPj4+Pj4+Pj4+Ojo6Ojo6Ojo2NjY2NjY2NjYyMjIyMjIyMjIyLi4JDQ0RERUVGRkdHSEhISUlKSktLS0xMTU1NTk5PT09QUFFRUVJSUlNTU1RUVVVVVlZWV1dXWFhYWFlZWVpaWltbW1tcXFxdXV1dXl5eX19fX2BgYGBhYWFhYmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpampqampqa2tra2trbGxsbGxsbW1tbW1tbW5ubm5ubm5vb29vb29vb3BwcHBwcHBwcXFxcXFxcXFxcnJycnJycnJyc3Nzc3Nzc3Nzc3R0dHR0dHR0dHR0dXV1dXV1dXV1dXV1dnZ2dnZ2dnZ2dnZ2dnd3d3d3d3d3d3d3d3d3eHh4eHicwL+/vr69vby8u7u7urq5ubi4t7e2tra1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampqWlpaSkpKOjo6OioqKhoaGhoKCgoJ+fn5+enp6enZ2dnZycnJycm5ubm5qampqamZmZmZmYmJiYmJeXl5eXlpaWlpaWlZWVlZVwTE1NTU5OT09PUFBRUVFSUlJTU1NUVFVVVVZWVldXV1hYWFhZWVlaWlpbW1tbXFxcXV1dXV5eXl9fX19gYGBgYWFhYWJiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpqampqamtra2tra2xsbGxsbG1tbW1tbW1ubm5ubm5ub29vb29vb29wcHBwcHBwcHFxcXFxcXFxcXJycnJycnJycnNzc3Nzc3Nzc3N0dHR0dHR0dHR0dHV1dXV1dXV1dXV1dXZ2dnZ2dnZ2dnZ2dnZ3d3d3d3d3d3d3d3d3d3d4eHh4eHh4eHh4eHh4eHh4eXl5eXl5eXl5uMHAwL+/vr69vby8u7u6urq5ubi4t7e2trW1tbS0s7OzsrKxsbGwsK+vr66urq2trKysq6urqqqqqampqKiop6enpqampaWlpaSkpKOjo6OioqKhoaGhoKCgoJ+fn5+enp6enZ2dnZycnJycm5ubm5qampqamZmZmZmYmJiYmJeXl5eXlpaWlpaWlZWVVU1NTk5OT09QUFBRUVFSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVlaWlpbW1tcXFxcXV1dXl5eXl9fX19gYGBgYWFhYWJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWpqampqamtra2tra2xsbGxsbG1tbW1tbW1ubm5ubm5ub29vb29vb29wcHBwcHBwcHFxcXFxcXFxcnJycnJycnJycnNzc3Nzc3Nzc3N0dHR0dHR0dHR0dXV1dXV1dXV1dXV1dnZ2dnZ2dnZ2dnZ2dnZ3d3d3d3d3d3d3d3d3d3h4eHh4eHh4eHh4eHh4eHh4eXl5eXl5eXl5i8HBwMC/v76+vb28vLu7urq5ubi4uLe3tra1tbW0tLOzsrKysbGwsLCvr6+urq2traysrKurq6qqqqmpqaioqKenp6ampqWlpaSkpKSjo6OioqKioaGhoaCgoKCfn5+fnp6enp2dnZ2cnJycm5ubm5uampqampmZmZmYmJiYmJiXl5eXl5aWlpaWlZWVg01OTk9PUFFRUlJTU1RUVVVWVldXV1hYWVlaWltbW1xcXV1dXl5fX19gYGBhYWJiYmNjY2RkZGVlZWZmZmZnZ2doaGhpaWlpampqamtra2tsbGxsbW1tbW5ubm5ub29vb29wcHBwcHFxcXFxcnJycnJyc3Nzc3NzdHR0dHR0dXV1dXV1dXZ2dnZ2dnZ2d3d3d3d3d3d4eHh4eHh4eHh5eXl5eXl5eXl5eXp6enp6enp6enp6e3t7e3t7e3t7e3t7e3t8fHx8fHx8fHx8fHx8fHx8fX19fX19fX19fX19fX19fX19fX19fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+foaJiYmJiIiIiIeHh4aGhoaGhYWFhYSEhISEg4ODg4OCgoKCgoGBgYGBgYCAgICAgIA=']
        });
        audio.laserProjectileSound = new Howl({
            src: ['data:audio/wav;base64,UklGRjkKAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YRUKAACkpKSkpKSjo6Ojo21bW1tbW1tbW1tbW4mkpKSkpKSko6OjkVtbW1tbW1tbW1tbYKSkpKSkpKSko6OjeltbW1tbW1tbW1tbe6SkpKSkpKSkpKOjX1tbW1tbW1tbW1tbkqSkpKSkpKSkpKORW1tbW1tbW1tbW1tgoKSkpKSkpKSkpKR/W1tbW1tbW1tbW1tupKSkpKSkpKSkpKRtW1tbW1tbW1tbW1typKSkpKSkpKSkpKRyW1tbW1tbW1tbW1t7pKSkpKSkpKSkpKRpW1tbW1tbW1tbW1t3pKSkpKSkpKSkpKRtW1tbW1tbW1tbW1x3pKSkpKSkpKSkpKRtW1tbW1tbW1tbXFx3pKSkpKSkpKSkpKR7W1tbW1tbW1tbXFxuoKSkpKSkpKSkpKSEW1tbW1tbW1tbXFxpm6SkpKSkpKSkpKSNW1tbW1tbW1tcXFxgjqSkpKSkpKSkpKSWaVtbW1tbW1tcXFxcgKSkpKSkpKSkpKSfcltbW1tbW1tcXFxcbpukpKSkpKSkpKSkjWRbW1tbW1tcXFxcYImkpKSkpKSkpKSkm3JbW1tbW1tcXFxcXHObpKSkpKSkpKSkpIlgW1tbW1tcXFxcXGCFpaSkpKSkpKSkpJt2W1tbW1tcXFxcXFxzl6WkpKSkpKSkpKSJZFtbW1tcXFxcXFxcgKWlpKSkpKSkpKSfgFtbW1tcXFxcXFxcaomlpaSkpKSkpKSklndbW1tcXFxcXFxcXHOSpaWkpKSkpKSkpI1yW1tcXFxcXFxcXFx8l6WlpKSkpKSkpKSEaVtbXFxcXFxcXFxcgJylpaWkpKSkpKSkgGRbXFxcXFxcXFxcYYCcpaWlpKSkpKSkpIBpW1xcXFxcXFxcXGGAnKWlpaWkpKSkpKSAaVtcXFxcXFxcXFxhgJylpaWlpKSkpKSkgG5cXFxcXFxcXFxcXICTpaWlpaWkpKSkpIRyXFxcXFxcXFxcXFx8jqWlpaWlpKSkpKSJd1xcXFxcXFxcXFxcc4ClpaWlpaWkpKSkl4BlXFxcXFxcXFxcXGqBnKWlpaWlpKSkpKCAblxcXFxcXFxcXFxcgYqlpaWlpaWkpKSkiYBcXFxcXFxcXFxcXHOBoKWlpaWlpaSkpJeAaVxcXFxcXFxcXFxhgY6lpaWlpaWlpKSkiYBgXFxcXFxcXFxcXHOBnKWlpaWlpaWkpJuAclxcXFxcXFxcXFxcgYWlpaWlpaWlpaSkjoBpXFxcXFxcXFxcXGqBjqWlpaWlpaWlpKSAgFxcXFxcXFxcXFxcc4GXpaWlpaWlpaWkoIB7XFxcXFxcXFxcXFx8gZylpaWlpaWlpaSSgHJcXFxcXFxcXFxcXIGBoKWlpaWlpaWlpJKAclxcXFxcXFxcXFxhgYGlpaWlpaWlpaWkjoByXFxcXFxcXFxcXGGBgaClpaWlpaWlpaWOgHJcXFxcXFxcXFxcYYGBoKWlpaWlpaWlpZKAfFxcXFxcXFxcXFxcgYGXpaWlpaWlpaWll4CAXFxcXFxcXFxcXFx8gZOlpaWlpaWlpaWbgIBgXFxcXFxcXFxcXHOBhaWlpaWlpaWlpaWAgG5cXFxcXFxcXFxcaoGBoaWlpaWlpaWlpY6AfFxcXFxcXFxcXFxcgYGOpaWlpaWlpaWlm4CAaVxcXFxcXFxcXFxzgYGlpaWlpaWlpaWlhYB3XFxcXFxcXFxcXGGBgZOlpaWlpaWlpaWXgIBqXFxcXFxcXFxcXG+BgZylpaWlpaWlpaWOgIBgXFxcXFxcXFxcXHyBhaWlpaWlpaWlpaWAgHxcXFxcXFxcXFxcYYGBiqWlpaWlpaWlpZyAgHNcXFxcXFxcXFxcaoGBk6WlpaWlpaWlpZKAgG5cXFxcXFxcXFxcb4GBk6WlpaWlpaWlpZKAgG5cXFxcXFxcXFxcc4GBmKWlpaWlpaWlpY6AgGpcXFxcXFxcXFxcc4GBk6WlpaWlpaWlpY6AgG5cXFxcXFxcXFxcc4GBk6WlpaWlpaWlpY6AgG5cXFxcXFxcXFxcb4GBiqWlpaWlpaWlpZOAgHdcXFxcXFxcXFxdaoGBhaWlpaWlpaWlpZyAgIBcXFxcXFxcXFxcYYGBgZylpaWlpaWlpaWAgIBqXFxcXFxcXFxcXXiBgY+lpaWlpaWlpaWOgIB3XFxcXFxcXFxcXWqBgYGlpaWlpaWlpaWcgICAZVxcXFxcXFxcXV18gYGPpaWlpaWlpaWljoCAfFxcXFxcXFxcXV1qgYGBoaWlpaWlpaWloICAgG5cXFxcXFxcXF1deIGBhqWlpaWlpaWlpZOAgIBhXFxcXFxcXF1dXYGBgY+lpaWlpaWlpaWOgICAYVxcXFxcXFxdXWaBgYGTpaWlpaWlpaWlhYCAfFxcXFxcXFxcXV1qgYGBmKWlpaWlpaWlpYCAgHdcXFxcXFxcXV1db4GBgZilpaWlpaWlpaWAgIB8XFxcXFxcXF1dXW+BgYGYpaWlpaWlpaWlgICAfFxcXFxcXFxdXV1qgYGBj6WlpaWlpaWlpYWAgIBhXFxcXFxcXV1dZoGBgYqlpaWlpaWlpaWKgICAZVxcXFxcXF1dXV2BgYGBoaWlpaWlpaWlk4CAgHNcXFxcXFxdXV1deIGBgZilpaWlpaWlpaCBgYGBXFxcXFxcXF1dXWqBgYGGpaWlpaWlpaWlioGBgW5cXFxcXFxdXV1dfYGBgZilpaWlpaWlpZyBgYGBXFxcXFxcXV1dXWqBgYGBpaWlpaWlpaWljoGBgXdcXFxcXFxdXV1deIGBgY+lpaWlpaWlpaWBgYGBalxcXFxcXV1dXWGBgYGBmKWlpaWlpaWll4GBgYFhXFxcXFxdXV1daoGBgYGhpaWlpaWlpaWOgYGBfFxcXFxcXV1dXV1vgYGBgaGlpaWlpaWlpY6BgYGBXFxcXFxdXV1dXXOBgYGBpaWlpaWlpaWlioGBgXxcXFxcXF1dXV1dc4GBgYGlpaWlpaWlpaWKgYGBgVxcXFxcXV1dXV1vgYGBgZylpaWlpaWlpZOBgYGBZVxcXFxdXV1dXWqBgYGBmKWlpaWlpaWll4GBgYFuXFxcXF1dXV1dYYGBgYGKpaWlpaWlpaWggYGBgXhcXFxcXV1dXV1deIGBgYGhpaWlpaWlpaWKgYGBgWVcXFxcXV1dXV1qgYGBgY+lpaWlpaWlpZyBgYGBeFxcXFxdXV1dXV19gYGBgaGlpaWlpaWlpYqBgYGBalxcXF1dXV1dXWaBgYGBhqWlpaWlpaWloIGBgYGBXFxcXF1dXV1dXXSBgYGBk6WlpaWlpaWll4GBgYF8XFxcXV1dXV1dXX2BgYGBmKWlpaSko6OijYGBgYF1YmJiY2NkZGRlZYGBgYGBlJmZmJiYl5eWhoCAgIB5bW1ubm5vb3BwcoCAgICAio2NjIyMi4uKgoCAgIB9eHh5eXp6ent7fICAgICAgYGBgICA']
        });
        audio.laserProjectileExplosionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRmcHAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YUMHAAAAPVyDkrBEX2+5YVyWT7qwWYGprGCOr3mDg52EUmJnW01pj7xyeVFyfZ+og3yAaY6itlySrLeblJuYi3OGvnR9gYqucr64uJp1lL2oiorAwZSCYlVuZ1mQknmBooldSlNslaFSeZebvVCChWNHPH+Jm39Rg5Syn3lrelBEVXRajnNaXquHYUhUUFVWT19pgLmkhXeGuZyAg8GLYmuYVXyMhT9SeJmlnZmZpLCggbenlo+Ci5ilo5hfeYulWk9igmZ2oKKbmqWqekmYfXund3KEY4izTGiEkJ+quaacqH9cgmdVlYVsnJV+rry3elyJpa+Gqb25tKuEWkyXbkVfdpqekWmlqkNdeGppaXR5gYaMmpuJcUhUWL28uqqgamRxcXF9jLGJcZaJdaKxbW9yiZZ5fYmOkVtXbHiKYUh+fkdku4lXbHh6enNqUGKBipNnTlZbkqVfWW9rSVqOcVVkaZ6dZWyAmbOFaU5GYGNSXamefnJOXHKNuY5HSkx8q6COc1hqiZKrrbGbW2GNiWxsYF6FnJSOlaCTbGpmanZsTVuGg3p1T1FfX15eamxRSWZwY1t7sKiOjHt7b25sa2xtbnh4dnaetqVwcJ+fmpaShYV5d3yBgVpaUktUlJR9ZmRYWG5xhJCds7OCgpSaf1JbnJuHgHFYWKGrjW5ubW1tbW1paY2joIWFh4mJcW1/np6lp59mZmJeXltaWnR4fYyMfnBwdnp6iI2Nl5mZaWJlf390U1N3jIyjo6arq2tWV2NjgLCwgmZmdXh+p6edjIyAc3NpYmJrbm6Pk5N4dHSZmZmVlJR8eHhqZWVkZGRbUVFkgoKDjo6OZmBga3d3fouLi6avr5hzc3OTmJiGaGhoXFpaZ3x8hJmZnqyspnx8fJWYmIeCgpetraOEhISFhYWAfX10ZWVln6enhmZmZnR2dn6MjIyanp6bkJCQdFhYWH+MjIyIiIiHhYWFh4qKipGcnJybmpqal5KSkpCBgYGBgYGBgWdYWFh1paWlpYeDg4NyV1dXV5Cjo6OdkpKSfnFxcZaioqKZl5eXcHBwcXl5eX+kpKSkhISEhHx7e3uKk5OTiXd3d3d4eHh4m6amppVgYGBgb3R0dHNxcXFxeH9/f390bW1tbYOHh4eHiImJiYmcn5+fn5qXl5eXg29vb295mJiYl5eipaWlpaOenp6enp2dnZ2dnXhiYmJiYn6Pj4+Pj3JiYmJiYmFgYGBgYGBhYmJiYmJqcnJycoqhoaGhhWlpaWmAlpaWlohcXFxcXHd3d3d3cW1tbW5vdnZ2dnaKnZ2dnZ2Wk5OTk5OIhoaGhoeRkZGRkZGSkpKSkpKVlpaWlpaGa2tra2trbGxsbGxsdpWVlZSUlJWXl5eXl5eKYmJiYmJiZn2BgYGBgYGDhISEhISEhHx5eXl5eXl5cW9vb29vb2+FjY2NjY2NjYd2dnZ2dnZ2doOQkJCQkJCQkIZ2dnZ2dnZ2dnd5eXl5eXl5eXl4dHR0dHR0dHR0dX6CgoKCgoKCgoKBfn19fX19fX19fX+JjIyMjIyMjIyMjIhoaGhoaGhobnJycnJycnJ2dnZ2dnZ2eYGBgYGBgYGEjIyMjIyMjIuJiYmJiYmJiZGZmZmZmJiYmHVpaWlpampqanN2dnZ2dnZ2dnl+fn5+fn5+fn6Gi4uLi4uLi4uLgHV1dXV1dXV1dXeGhoaGhoaGhoaGgXR0dHR0dHR0dHR0hYuLi4uLi4uLi4uLdGxsbGxsbGxsbGxte5KSkpKSkpKSkpGRkY57eHh4eHh4eHh4eHh4en9/f39/f39/f39/f39/fHNzc3Nzc3Nzc3Nzc3Nzc3uJiYmJiYmJiYmJiYmJiYiIhH17e3t7e3t7e3t7e3t7e3t7e3VycnJycnJycnJycnJycnJycnJye4qKioqKioqKioqKioqKioqKioqKiomIh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHhoOCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKChIeJiYmIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIhoSAf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fnx6eHV2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnd3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh5eXl5eXl5ent8fH1+f3+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIB/f39/fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn9/f39/f39/f39/f39/f39/f39/f39/f39/gA==']
        });
        audio.pickupCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRmgIAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YUQIAAAIEBgfJy42PURMU1piaXB3foWMk5qhqK61vMLJ0Nbd4+nu6eLb1M3GwLmyq6WemJGLhH54cWtlX1lTTUdBOzUvKSMeHSQqMDY8Q0lPVVthZmxyeH6DiY+Ump+lqq+1ur/Eyc/U2NTPycS+ubOuqKOemZOOiYR/enVwa2ZiXVhUT0pGQT04NDM4PEFGS1BVWV5jZ2xwdXl+goaLj5OXnKCkqa2xtrq+wsbEwLy3s6+qpqKemZWRjIiEgHt3c29qZmJeWVVRTUlEQDw6PkJGSk9TV1tgZGhscHV5fYGFio6Slpqeo6err7O3u8DEw766trKuqaWhnZmVkYyIhIB8eHRwbGdjX1tXU09LR0M/PD9ESExQVFhcYGRobHB1eX2BhYmNkZWZnaGlqa2xtbm9wcG9ubWxrKikoJyYlJCMiYWBfXl1cW1pZWFdWVVRTUlGQj9BRUlNUVVZXWFlaW1xdHh8gISIjJCUl5ufo6err7K2ur6/u7ezr6unpKCcmJSQjImFgX15dnJuamZjX1tXVFBMSERBQ0dLT1JWWl5iZWltcXR4fICDh4uPkpaanaGlqaywtLe7vbm1sq6qpqOfm5iUkIyJhYF+enZzb2toZGFdWVZSTktHREVJTFBUV1tfYmZqbXF0eHx/g4aKjpGVmJyfo6aqrrG1uLq3tLCsqaWinpuXk5CMiYWCfnt3dHBtaWZiX1tYVFFNSkdHS05SVVlcYGNnam1xdHh7f4KGiY2Qk5eanqGkqKuvsrW4tbKuq6ikoZ2alpOQjImFgn97eHVxbmtnZGFdWldTUE1JSUxQU1ZaXWFkZ2tucXR4e36ChYiMj5KVmZyfoqaprK+ztbOwrammo6CcmZaTj4yJhoJ/fHl2cm9saWZiX1xZVlJPTEtOUVVYW15hZWhrbnF1eHt+gYSHi46RlJeanaCkp6qtsLOxrquopaKfm5iVko+MiYaDgHx5dnNwbWpnZGFeW1hVUk9NUFNWWVxfY2ZpbG9ydXh7foGEh4qNkJOWmZyfoaSnqq2wr6yppqOgnZqYlZKPjImGg4B9end0cW5saWZjYF1aV1VSUFJVWFteYWRmaWxvcnV4e32Ag4aJjI+RlJeanZ+ipairra2qqKWin5yZl5SRjouJhoOAfXt4dXJwbWpnZWJfXFpXVFJUV1pcX2JlZ2ptcHJ1eHt9gIOFiIuNkJOVmJudoKOlqKurqaajoJ6bmJaTkI6LiIaDgX57eXZzcW5saWZkYV9cWldVVllbXmFjZmhrbnBzdXh6fYCChYeKjI+RlJaZm56go6Woqaekop+cmpeVkpCNi4iGg4F+fHl3dHJvbWtoZmNhXlxaV1hbXWBiZWdpbG5xc3Z4en1/goSHiYuOkJKVl5qcnqGjpaeloqCdm5mWlJGPjYqIhoOBf3x6eHVzcW5samhlY2FeXFpaXV9hZGZoam1vcXR2eHp9f4GEhoiKjY+Rk5WYmpyeoKOko6CenJqXlZORjoyKiIaDgX99e3h2dHJwbmxpZ2VjYV9dXF9hY2VnaWxucHJ0dnh7fX+Bg4WHiYuNkJKUlpianJ6goqCenJqYlpSSkI6MioeFg4F/fXt5d3VzcW9ta2lnZWNhX19hY2VnaWttb3FzdXd5e31/gYOEhoiKjI6QkpSWmJqcnZ+enJqZl5WTkY+Ni4mHhYOBgH58enh2dHJxb21raWdmZGJhY2VmaGpsbnByc3V3eXt9foCChIaHiYuNj5CSlJaXmZudnJqZl5WTkZCOjIqJh4WDgYB+fHt5d3V0cnBvbWtpaGZkY2VmaGpsbW9xcnR2eHl7fX6AgoOFh4iKjI2PkJKUlZeYmpqYl5WTkpCOjYuKiIaFg4KAfn17enh2dXNycG9tbGpoZ2ZnaGpsbW9wcnN1d3h6e31+gIGDhIaHiYqMjY+QkpOVlpiYlpWTkpCPjYyKiYeGhIOCgH99fHp5d3Z1c3Jwb25sa2loaWpsbW9wcnN0dnd5ent9foCBgoSFhoiJioyNjpCRkpSVlZSTkZCPjYyLiYiHhYSDgYB/fnx7enh3dnVzcnFwbm1sa2ttbm9wcnN0dXd4eXp8fX5/gYKDhIWHiImKi42Oj5CRkpOSkZCOjYyLioiHhoWEg4GAf359fHt5eHd2dXRzcnFvbm1tb3BxcnN0dXd4eXp7fH1+f4CBgoSFhoeIiYqLjI2Oj5CRkI+OjYyLioiHhoWEg4KBgH9+fXx7enl4d3Z1dXRzcnFwcHFyc3R1dnd4eXp6e3x9fn+AgYKDhIWGhoeIiYqLjI2Njo6NjIuKiYiHhoWFhIOCgYB/f359fHt6enl4d3Z1dXRzcnJzdHV1dnd4eXp6e3x9fn5/gIGBgoOEhYWGh4eIiYqKi4yLi4qJiIiHhoWFhIOCgoGAgH9+fX18e3t6eXl4d3d2dXV0dXZ3d3h5eXp7e3x9fX5+f4CAgYKCg4OEhYWGhoeIiImJiYiIh4eGhYWEhIOCgoGBgIB/fn59fXx8e3t6enl5eHh3d3d4eHl6ent7fHx9fX5+f3+AgIGBgoKCg4OEhIWFhoaGh4eGhoWFhISDg4OCgoGBgICAf39+fn59fXx8fHt7e3p6enl6enp7e3x8fH19fX5+f39/gICAgYGBgYKCgoODg4SEhISEhISDg4OCgoKCgYGBgICAgH9/f39+fn5+fX19fX18fHx8fHx8fX19fX5+fn5/f39/f4CAgICAgIGBgYGBgYGCgoKCgoKCgYGBgYGBgICAgICAgIB/f39/f39/f39/f35+fn5+fn5+f39/f39/f39/f39/f39/gICAgICAgICAgICAgICAgICA']
        });
        audio.playerCollisionSound = new Howl({
            src: ['data:audio/wav;base64,UklGRpMGAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAZGF0YW8GAACko6Ojo6KioqGhoaGgoKCgn5+fn56eVVZWVldXV1hYWFlZWVpaWltbW1tcXFxdXV1dXl5eXl9fX19gYGBgYY6pqamoqKinp6empqalpaWlpKSko6N/WltbW1xcXFxdXV1eXl5eX19fX2BgYGBhYWFhYmJiYmNjY2NjZGRkba2trKyrq6uqqqqpqamoqKinp6empqZdXV5eXl9fX19gYGBgYWFhYWJiYmJiY2NjY2RkZGRlZWVlZWZmZmZmlK+urq6tra2srKyrq6qqqqmpqaioqINfX2BgYGBhYWFhYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hxsLCvr6+urq6tra2srKurq6qqqqmpqWBgYWFhYWFiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGiWsbCwsK+vr66ura2trKysq6urqqqqhWFhYWJiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaXKysbGwsLCvr66urq2traysq6urqqqqYWFiYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaZeysbGwsLCvr66urq2traysrKurq6qGYWJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpc7KysbGwsLCvr66urq2traysrKurqqphYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpl7KxsbGwsLCvr66urq2traysq6urqoZiYmJiY2NjY2NkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlzsrKxsbGwsK+vr66ura2trKysq6urqmJiYmJjY2NjY2RkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWqXsrKxsbCwsK+vrq6ura2trKysq6urhmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpanOysrGxsbCwr6+vrq6ura2srKyrq6uqYmJiYmNjY2NjZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpapeysrGxsLCwr6+urq6tra2srKyrq6uGYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqc7KysbGxsLCvr6+urq6traysrKurq6piYmJiY2NjY2NkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlql7KysbGwsLCvr6+urq2traysrKurq4ZiYmJiY2NjY2RkZGRkZWVlZWZmZmZmZ2dnZ2doaGhoaGhpaWlpaWpzsrKxsbGwsK+vr66urq2trKysq6urqmJiYmJjY2NjZGRkZGRlZWVlZWZmZmZmZ2dnZ2doaGhoaGlpaWlpaWqXsrKxsbCwsK+vr66ura2trKysq6urhmJiYmJjY2NjZGRkZGRlZWVlZmZmZmZnZ2dnZ2hoaGhoaGlpaWlpanOysrGxsbCwr6+vrq6ura2srKyrq6uqYmJiYmNjY2NkZGRkZGVlZWVlZmZmZmZnZ2dnZ2hoaGhoaWlpaWlpapeysrGxsLCwr6+vrq6tra2srKyrq6uGYmJiYmNjY2NkZGRkZGVlZWVmZmZmZmdnZ2dnaGhoaGhoaWlpaWlqc7KysbGxsLCvr6+urq6traysrKurq6piYmJiY2NjY2RkZGRkZWVlZWVmZmZmZmdnZ2dnaGhoaGhpaWlpaWlql7KysbGwsLCvr6+urq2traysrKurq4ZiYmJjY2NkZGRlZWVlZmZmZ2dnZ2hoaGlpaWlqampqa2tra2xsbGx0rKurqqqpqaiop6empqalpaSko6OiomhoaGhpaWlpampqa2tra2xsbGxsbW1tbW5ubm5ub29vb3BwcHBwcXGPoaGhoKCfn56enp2dnZycm5ubmpqag25ubm5vb29vb3BwcHBxcXFxcXJycnJycnNzc3NzdHR0dHR0dXV1dXmXl5eWlpaVlZWUlJSTk5OTkpKSkZGRdHR0dHR0dXV1dXV2dnZ2dnZ3d3d3d3d3eHh4eHh4eHl5eXl5eXl5eoaNjYyMjIyLi4uLioqKioqJiYmJiIiBenp6enp6ent7e3t7e3t7fHx8fHx8fHx8fX19fX19fX19fX5+fn5+f4ODg4KCgoKCgYGBgYGBgYCAgICAgIA=']
        });

        icon.sfxOff = new Image();
        icon.sfxOff.src = "images/sfx_off.png";

        icon.sfxOn = new Image();
        icon.sfxOn.src = "images/sfx_on.png";
        
        // call the callback function passed as a parameter, 
        // we're done with loading assets
        callback();
    };

    var start = function() {
        // reset game state
        gameState.currentScore = 0;
        gameState.pauseListener = false;
        gameState.hasWall = false;
        spawn.pickupArray = [];
        spawn.projectileArray = [];

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

        // load assets, then when this is done, start the mainLoop
        loadAssets(function() {
            // we enter here only when all assets have been loaded
            gameState.displayTitle = true;
            gameState.displayTitleTimerStartTime = performance.now();

            button.sfxToggleBtn = new ToggleButton(3, (canvas.h-27), 24, 24, 'gray', icon.sfxOn);
            addMouseListeners(gameCanvas, ball, button, canvas.ctx, handler, icon, inputState);
            addTestListener(blocks, handler);

            // start the game
            mainLoop();
        });
    };

    function mainLoop(now) {
        // check whether the title screen has finished
        if (now - gameState.displayTitleTimerStartTime > gameState.displayTitleTimer) {
            gameState.displayTitle = false;
            
            // add the pause listener during gameplay
            if (!gameState.pauseListener) {
                addPauseListener(gameState, handler, htmlElements);
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

                button.sfxToggleBtn.draw(canvas.ctx);
                
                // revert player width if growth pickup timer has elapsed
                if ((player.growthActive === true) && 
                    (now - gameState.pickupGrowthTimerStartTime > gameState.pickupGrowthTimer)) {
                        player.width = playerInit.playerWidth;
                        player.growthActive = false;
                }

                // move projectiles if any
                if (spawn.projectileArray.length > 0) {
                    spawn.projectileArray.forEach(projectile => {
                        projectile.draw(canvas.ctx);
                        projectile.incrementY = calcIncrement(projectile.speedY, delta);
                        moveProjectile(projectile);
                    });
                }
                
                // revert player color once projectiles have run out
                if ((player.color !== playerInit.playerColor) && 
                    (player.numProjectiles === 0)) {
                        player.color = playerInit.playerColor;
                        removeProjectileListener(gameCanvas, handler);
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
                if (spawn.pickupArray.length > 0) {
                    spawn.pickupArray.forEach((pickup, index) => {
                        pickup.draw(canvas.ctx);
                        pickup.incrementY = calcIncrement(pickup.speedY, delta);
                        movePickup(pickup, index);
                    })
                }

                displayHUD();

                // make the player follow the mouse
                // test if the mouse is positioned over the canvas first
                if(inputState.mousePos !== undefined) {
                    player.move(inputState.mousePos.x, canvas.w);
                    if (ball.isAttached) {
                        ball.followPlayer(inputState.mousePos.x, player, canvas.w);
                        // make sure the ball always travels upwards on reset
                        ball.speedY = -Math.abs(ball.speedY);
                    }
                }
            }
    
            if (checkLevelCleared()) {
                removeAllListeners();
                start();

            } else if (checkWinCondition()) {
                removeAllListeners();
                displayWinScreen();

            } else if (checkLoseCondition()) {
                removeAllListeners();
                displayLoseScreen();

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
        let blockArray = [];
        let blockGap = 3;
        let blockWidth = 60;
        let blockHeight = 20;

        if (gameState.currentLevel === 1) {
            blockArray = createLevel1Layout(blockArray, blockGap, blockWidth, blockHeight, blockColor, canvas, spawn);
        } else if (gameState.currentLevel === 2) {
            blockArray = createLevel2Layout(blockArray, blockGap, blockWidth, blockHeight, blockColor, canvas, spawn);
        } else if (gameState.currentLevel === 3) {
            blockArray = createLevel3Layout(blockArray, blockGap, blockWidth, blockHeight, blockColor, wall, spawn);
        } else if (gameState.currentLevel === 4) {
            blockArray = createLevel4Layout(blockArray, blockGap, blockWidth, blockHeight, blockColor, breakableBlockColor, canvas, spawn);
        } else if (gameState.currentLevel === 5) {
            blockArray = createLevel5Layout(blockArray, blockGap, blockWidth, blockHeight, blockColor, breakableBlockColor, wall, spawn);
        }

        return blockArray;
    }

    function drawAllBlocks(blockArray) {
        blockArray.forEach(function(b) {
            b.draw(canvas.ctx);
        });
    }

    function displayHUD() {
        let hudXLeftAlign = 40;
        let hudXCenterAlign = canvas.w / 2;
        let huxXRightAlign = canvas.w - 40;
        let hudYTopAlign = 5;

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

    function displayLoseScreen() {
        const midX = canvas.w / 2;
        const midY = canvas.h / 2;
        
        const buttonColor = 'white';
        const buttonTextColor = 'black';
        const buttonHeight = 50;
        const buttonWidth = 100;
        const buttonText = 'RESTART';
        const buttonX = midX - (buttonWidth / 2);
        const buttonY = midY + (canvas.h-midY) / 2;

        const highScoreY = midY + (buttonY - midY) / 2;

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.font = "bold 100px sans-serif";
        canvas.ctx.fillStyle = 'red';
        canvas.ctx.textAlign = "center";
        canvas.ctx.textBaseline = "middle";
        canvas.ctx.fillText(`YOU LOSE`, midX, midY);

        if (localStorage.highScore) {
            canvas.ctx.font = "30px sans-serif";
            canvas.ctx.fillStyle = 'white';
            canvas.ctx.textAlign = "center";
            canvas.ctx.textBaseline = "middle";
            canvas.ctx.fillText(`High Score: ${localStorage.highScore}`, midX, highScoreY);
        }

        let restartButton = new Button(buttonX, buttonY, buttonWidth, buttonHeight, buttonColor, buttonText, buttonTextColor);
        restartButton.draw(canvas.ctx);
        
        addButtonListeners(gameCanvas, canvas.ctx, handler, restartButton);
    }
    
    function displayWinScreen() {
        const midX = canvas.w / 2;
        const midY = canvas.h / 2;
        
        const buttonColor = 'white';
        const buttonTextColor = 'black';
        const buttonHeight = 50;
        const buttonWidth = 100;
        const buttonText = 'RESTART';
        const buttonX = midX - (buttonWidth / 2);
        const buttonY = midY + (canvas.h-midY) / 2;

        const highScoreY = midY + (buttonY - midY) / 2;

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.font = "bold 100px sans-serif";
        canvas.ctx.fillStyle = 'green';
        canvas.ctx.textAlign = "center";
        canvas.ctx.textBaseline = "middle";
        canvas.ctx.fillText(`YOU WIN`, midX, midY);
        
        if (localStorage.highScore) {
            canvas.ctx.font = "30px sans-serif";
            canvas.ctx.fillStyle = 'white';
            canvas.ctx.textAlign = "center";
            canvas.ctx.textBaseline = "middle";
            canvas.ctx.fillText(`High Score: ${localStorage.highScore}`, midX, highScoreY);
        }

        let restartButton = new Button(buttonX, buttonY, buttonWidth, buttonHeight, buttonColor, buttonText, buttonTextColor);
        restartButton.draw(canvas.ctx);
        
        addButtonListeners(gameCanvas, canvas.ctx, handler, restartButton);
    }

    function displayTitleScreen() {
        const titleX = canvas.w / 2;
        const titleY = canvas.h / 2;

        // remove the pause listener during the title screen
        removePauseListener(handler);
        handler.pauseGameHandler = undefined;
        gameState.pauseListener = false;

        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
        canvas.ctx.font = "bold 100px sans-serif";
        canvas.ctx.fillStyle = 'white';
        canvas.ctx.textAlign = "center";
        canvas.ctx.textBaseline = "middle";
        canvas.ctx.fillText(`LEVEL ${gameState.currentLevel}`, titleX, titleY);
    }

    function moveBall(b) {
        b.move();    
        testCollisionBallWithWalls(b, audio, canvas);
        testCollisionBallWithPlayer(b, audio, player, ballInit);
        testCollisionBallWithBlocks(b, audio, blocks, breakableBlockColor, gameState, spawn);
        if (gameState.hasWall === true) {
            testCollisionBallWithInnerWalls(b, wall);
        }
    }

    function movePickup(p, index) {
        p.move();
        testCollisionPickupWithFloor(p, spawn, index, canvas);
        testCollisionPickupWithPlayer(p, spawn, index, audio, handler, player, playerInit, gameState, gameCanvas);
    }

    function moveProjectile(p) {
        p.move();
        testCollisionProjectileWithBlocks(p, audio, blocks, gameState, spawn);
        testCollisionProjectileWithWalls(p, spawn);
    }

    function removeAllListeners() {
        removeMouseListeners(gameCanvas, handler);
        handler.detachBallHandler = undefined;
        handler.mouseMovedHandler = undefined;

        removePauseListener(handler);
        handler.pauseGameHandler = undefined;
        gameState.pauseListener = false;

        if (handler.fireProjectileHandler) {
            removeProjectileListener(gameCanvas, handler);
            handler.fireProjectileHandler = undefined;
        }

        removeTestListener(handler);
        handler.clearBlocksHandler = undefined;
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
    }

    var checkWinCondition = function() {
        if (blocks.length === 0 && 
            gameState.currentLevel === gameState.totalLevels) {
                gameState.totalScore += gameState.currentScore;
                saveHighScore();
                return true;
        }
    }

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
    
        let startButton = new Button(buttonX, buttonY, buttonWidth, buttonHeight, buttonColor, buttonText, buttonTextColor);
        startButton.draw(canvas.ctx);
        
        addButtonListeners(gameCanvas, canvas.ctx, handler, startButton);
    }

    var getSFX = function() {
        return audio.sfx;
    };

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

    return {
        gameState: gameState,
        start: start,
        checkLoseCondition: checkLoseCondition,
        checkWinCondition: checkWinCondition,
        displayStartScreen: displayStartScreen,
        getSFX: getSFX,
        playerFail: playerFail,
        toggleSFX: toggleSFX
    };
};

window.onload = function init() {
    gameCanvas = document.querySelector("#gameCanvas");
    game = new Game();
    game.displayStartScreen();
};