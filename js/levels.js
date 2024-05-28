function createLevel1Layout(blockArray, blockGap, blockWidth, blockHeight, blockColor, canvas, spawn) {
    let rows = 6;
    let cols = 10;
    
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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, blockColor[r], false);
            blockArray.push(block);
        }
    }
    randomlyAssignPickupsToBlocks(blockArray, spawn);
    return blockArray;
}

function createLevel2Layout(blockArray, blockGap, blockWidth, blockHeight, blockColor, canvas, spawn) {
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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, blockColor[r], false);
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
    
    randomlyAssignPickupsToBlocks(blockArray, spawn);
    return blockArray;
}

function createLevel3Layout(blockArray, blockGap, blockWidth, blockHeight, blockColor, wall, spawn) {
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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, blockColor[r], false);
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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, blockColor[r], false);
            blockArray.push(block);
        }
    }
    randomlyAssignPickupsToBlocks(blockArray, spawn);
    return blockArray;
}

function createLevel4Layout(blockArray, blockGap, blockWidth, blockHeight, blockColor, breakableBlockColor, canvas, spawn) {
    let rows = 9;
    let cols = 1;
    let colsMax = 9;
    
    let rowsBreakable = 1;
    let colsBreakable = 10;

    // create right-angled triangle of blocks (stacked left)
    for (let r=0; r < rows; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;

        blockY = blockYSpacing + r*blockYSpacing;

        for (let c=0; c < cols; c++) {
            let blockX;
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (canvas.w - blockXSpacing*(colsMax+1)) / 2; // 10 cols fit across the canvas width with these block dimensions

            blockX = leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, blockWidth, blockHeight, blockColor[r], false);
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

            if (c === colsBreakable-1) {
                var block = new Block(blockX, blockY, blockWidth, blockHeight, 'white', false);
            } else {
                var block = new Block(blockX, blockY, blockWidth, blockHeight, breakableBlockColor[breakableBlockColor.length-1], true);
            }
            blockArray.push(block);
        }
    }
    randomlyAssignPickupsToBlocks(blockArray, spawn);
    return blockArray;
}

function createLevel5Layout(blockArray, blockGap, blockWidth, blockHeight, blockColor, breakableBlockColor, wall, spawn) {
    let rows = 8;
    let cols = 4;

    let rowsBreakable = 2;
    let colsBreakable = 4;

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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, blockColor[r], false);
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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, breakableBlockColor[breakableBlockColor.length-1], true);
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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, blockColor[r], false);
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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, breakableBlockColor[breakableBlockColor.length-1], true);
            blockArray.push(block);
        }
    }
    randomlyAssignPickupsToBlocks(blockArray, spawn);
    return blockArray;
}