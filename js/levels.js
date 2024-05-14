function createLevel1Layout(blockArray, blockGap, blockWidth, blockHeight, canvas) {
    let color = 'grey';
    let health = 1;
    
    let rows = 6;
    let cols = 10;

    let numPickups = 3;
    
    // create rect of blocks
    for (let r=0; r < rows; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;
        let topGapY = 50;

        if (r === 0) {
            blockY = topGapY; 
        } else {
            blockY = topGapY + r*blockYSpacing;
        }

        for (let c=0; c < cols; c++) {
            let blockX;
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (canvas.w - blockXSpacing*cols) / 2;

            if (c === 0) {
                blockX = leftGapX;
            } else {
                blockX = leftGapX + c*blockXSpacing;
            }

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color, health);
            blockArray.push(block);
        }
    }

    // randomly assign pickups to blocks in array
    for (let i = 0; i < numPickups; i++) {
        let randomInt = getRandomInt(1, blockArray.length-1);
        blockArray[randomInt].hasPickup = true;
    }

    return blockArray;
}

function createLevel2Layout(blockArray, blockGap, blockWidth, blockHeight, canvas) {
    let color = 'blue';
    let health = 1;
    
    let rows = 9;
    let cols = 1;
    let colsMax = 9;
    
    let canvasCenter = canvas.w / 2;
    let blockCenter = blockWidth / 2;

    // create diamond of blocks
    for (let r=0; r < rows; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;
        let topGapY = 50;

        if (r === 0) {
            blockY = topGapY;
        } else {
            blockY = topGapY + r*blockYSpacing;
        }

        for (let c=0; c < cols; c++) {
            let blockX = canvasCenter - blockCenter;
            let blockXSpacing = blockWidth + blockGap;

            // use row num as basis for spacing top of diamond horizontally
            if (r !== 0 && colsMax === rows) {
                blockX = (blockX - blockXSpacing*r) + c*blockXSpacing;
            // halve max cols then use whole portion as basis for spacing bottom of diamond horizontally
            } else if (colsMax < rows) {
                blockX = (blockX - blockXSpacing*parseInt(colsMax/2)) + c*blockXSpacing;
            }

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color, health);
            blockArray.push(block);
        }

        // grow the num of cols while under max
        // to make the top of the diamond
        if (cols !== colsMax) {
            cols += 2;
        // shrink the num of cols when it reaches max
        // to make the bottom of the diamond
        } else if (cols > 0 && cols === colsMax) {
            cols -= 2;
            colsMax = cols;
        }
    }
    
    return blockArray;
}

function createLevel3Layout(blockArray, blockGap, blockWidth, blockHeight, wall) {
    let color = 'green';
    let health = 1;

    let rows = 10;
    let cols = 4;

    // populate blocks left of wall
    for (let r=0; r < rows; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;
        let topGapY = 50;

        if (r === 0) {
            blockY = topGapY; 
        } else {
            blockY = topGapY + r*blockYSpacing;
        }

        for (let c=0; c < cols; c++) {
            let blockX;
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (wall.x - blockXSpacing*cols) / 2;

            if (c === 0) {
                blockX = leftGapX;
            } else {
                blockX = leftGapX + c*blockXSpacing;
            }

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color, health);
            blockArray.push(block);
        }
    }

    // populate blocks right of wall
    for (let r=0; r < rows; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;
        let topGapY = 50;

        if (r === 0) {
            blockY = topGapY; 
        } else {
            blockY = topGapY + r*blockYSpacing;
        }

        for (let c=0; c < cols; c++) {
            let blockX;
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (wall.x - blockXSpacing*cols) / 2;

            if (c === 0) {
                blockX = (wall.x + wall.width) + leftGapX;
            } else {
                blockX = (wall.x + wall.width) + leftGapX + c*blockXSpacing;
            }

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color, health);
            blockArray.push(block);
        }
    }
    
    return blockArray;
}

function createLevel4Layout(blockArray, blockGap, blockWidth, blockHeight, canvas) {
    let color = 'purple';
    let health = 1;
    let rows = 9;
    let cols = 1;
    let colsMax = 9;
    
    let rowsBreakable = 1;
    let colsBreakable = 10;
    let healthBreakable = 3;

    let colorLightBrown = 'rgb(153, 79, 0)';
    let colorMedBrown = 'rgb(102, 53, 0)';
    let colorDarkBrown = 'rgb(51, 26, 0)';
    
    let colorArrayBreakable = [ 
        colorLightBrown,
        colorMedBrown,
        colorDarkBrown
    ];

    // create right-angled triangle of blocks (stacked left)
    for (let r=0; r < rows; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;

        if (r === 0) {
            blockY = blockYSpacing;
        } else {
            blockY = blockYSpacing + r*blockYSpacing;
        }

        for (let c=0; c < cols; c++) {
            let blockX;
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (canvas.w - blockXSpacing*(colsMax+1)) / 2; // 10 cols fit across the canvas width with these block dimensions

            blockX = leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color, health);
            blockArray.push(block);
        }

        // increment max columns per row to create triangle shape
        if (cols !== colsMax) { cols++; }
    }

    // create row of breakable blocks
    for (let r=0; r < rowsBreakable; r++) {
        let blockYSpacing = blockHeight + blockGap;
        let blockY = blockYSpacing + blockYSpacing*rows;

        for (let c=0; c < colsBreakable; c++) {
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (canvas.w - blockXSpacing*colsBreakable) / 2;
            let blockX = leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, blockWidth, blockHeight, colorArrayBreakable[healthBreakable-1], healthBreakable, colorArrayBreakable);
            blockArray.push(block);
        }
    }

    return blockArray;
}

function createLevel5Layout(blockArray, blockGap, blockWidth, blockHeight, wall) {
    let color = 'teal';
    let health = 1;

    let rows = 8;
    let cols = 4;

    let rowsBreakable = 2;
    let colsBreakable = 4;
    let healthBreakable = 3;

    let colorLightBrown = 'rgb(153, 79, 0)';
    let colorMedBrown = 'rgb(102, 53, 0)';
    let colorDarkBrown = 'rgb(51, 26, 0)';
    
    let colorArrayBreakable = [ 
        colorLightBrown,
        colorMedBrown,
        colorDarkBrown
    ];

    // populate blocks left of wall
    for (let r=0; r < rows; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;
        let topGapY = 50 + blockYSpacing;

        if (r === 0) {
            blockY = topGapY;
        } else {
            blockY = topGapY + r*blockYSpacing;
        }

        for (let c=0; c < cols; c++) {
            let blockX;
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (wall.x - blockXSpacing*cols) / 2;

            if (c === 0) {
                blockX = leftGapX;
            } else {
                blockX = leftGapX + c*blockXSpacing;
            }

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color, health);
            blockArray.push(block);
        }
    }

    // create 2 rows of breakable blocks left of wall
    for (let r=0; r < rowsBreakable; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;
        let topGapY = 50;

        if (r === 0) {
            blockY = topGapY;
        } else {
            blockY = topGapY + (rows+1)*blockYSpacing;
        }

        for (let c=0; c < colsBreakable; c++) {
            let blockX;
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (wall.x - blockXSpacing*cols) / 2;

            if (c === 0) {
                blockX = leftGapX;
            } else {
                blockX = leftGapX + c*blockXSpacing;
            }

            let block = new Block(blockX, blockY, blockWidth, blockHeight, colorArrayBreakable[healthBreakable-1], healthBreakable, colorArrayBreakable);
            blockArray.push(block);
        }
    }

    // populate blocks right of wall
    for (let r=0; r < rows; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;
        let topGapY = 50 + blockYSpacing;

        if (r === 0) {
            blockY = topGapY;
        } else {
            blockY = topGapY + r*blockYSpacing;
        }

        for (let c=0; c < cols; c++) {
            let blockX;
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (wall.x - blockXSpacing*cols) / 2;

            if (c === 0) {
                blockX = (wall.x + wall.width) + leftGapX;
            } else {
                blockX = (wall.x + wall.width) + leftGapX + c*blockXSpacing;
            }

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color, health);
            blockArray.push(block);
        }
    }

    // create 2 rows of breakable blocks right of wall
    for (let r=0; r < rowsBreakable; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;
        let topGapY = 50;

        if (r === 0) {
            blockY = topGapY;
        } else {
            blockY = topGapY + (rows+1)*blockYSpacing;
        }

        for (let c=0; c < colsBreakable; c++) {
            let blockX;
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (wall.x - blockXSpacing*cols) / 2;

            if (c === 0) {
                blockX = (wall.x + wall.width) + leftGapX;
            } else {
                blockX = (wall.x + wall.width) + leftGapX + c*blockXSpacing;
            }

            let block = new Block(blockX, blockY, blockWidth, blockHeight, colorArrayBreakable[healthBreakable-1], healthBreakable, colorArrayBreakable);
            blockArray.push(block);
        }
    }
    
    return blockArray;
}