// for time based animation
var delta, then;

function calcIncrement(speed, del) {
    return (speed*del) / 1000;
}

// test whether rectangle and circle overlap
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
    let testX=cx;
    let testY=cy;
    if (testX < x0) testX=x0; // test left
    if (testX > (x0+w0)) testX=(x0+w0); // test right
    if (testY < y0) testY=y0; // test top
    if (testY > (y0+h0)) testY=(y0+h0); // test bottom
    return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY)) < r*r); // to avoid expensive sqrt calc
}

// for randomly assigning pickups to blocks
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}