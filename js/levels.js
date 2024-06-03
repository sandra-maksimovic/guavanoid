function createLevel1Layout() {
    let rows = 6;
    let cols = 10;
    
    // create rect of blocks
    for (let r=0; r < rows; r++) {
        let blockYSpacing = game.blockInit.blockHeight + game.blockInit.blockGap;
        let topGapY = 50;
        let blockY = topGapY + r*blockYSpacing;

        for (let c=0; c < cols; c++) {
            let blockXSpacing = game.blockInit.blockWidth + game.blockInit.blockGap;
            let leftGapX = (game.canvas.w - blockXSpacing*cols) / 2;
            let blockX = leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, 
                            game.blockInit.blockWidth, 
                            game.blockInit.blockHeight, 
                            game.blockInit.blockColor[r], 
                            false);
            game.blockInit.blockArray.push(block);
        }
    }

    randomlyAssignPickupsToBlocks();
    return game.blockInit.blockArray;
}

function createLevel2Layout() {
    let rows = 9;
    let cols = 1;
    let colsMax = 9;

    let blockCenter = game.blockInit.blockWidth / 2;
    let canvasCenter = game.canvas.w / 2;

    // create diamond of blocks
    for (let r=0; r < rows; r++) {
        let blockYSpacing = game.blockInit.blockHeight + game.blockInit.blockGap;
        let topGapY = 50;
        let blockY = topGapY + r*blockYSpacing;

        for (let c=0; c < cols; c++) {
            let blockX = canvasCenter - blockCenter;
            let blockXSpacing = game.blockInit.blockWidth + game.blockInit.blockGap;

            // use row num as basis for spacing top of diamond horizontally
            if (r !== 0 && colsMax === rows) {
                blockX = (blockX - blockXSpacing*r) + c*blockXSpacing;
            // halve max cols then use whole portion as basis for spacing bottom of diamond horizontally
            } else if (colsMax < rows) {
                blockX = (blockX - blockXSpacing*parseInt(colsMax/2)) + c*blockXSpacing;
            }

            let block = new Block(blockX, blockY, 
                            game.blockInit.blockWidth, 
                            game.blockInit.blockHeight, 
                            game.blockInit.blockColor[r], 
                            false);
            game.blockInit.blockArray.push(block);
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
    
    randomlyAssignPickupsToBlocks();
    return game.blockInit.blockArray;
}

function createLevel3Layout() {
    let rows = 8;
    let cols = 4;

    let blockXSpacing = game.blockInit.blockWidth + game.blockInit.blockGap;
    let blockYSpacing = game.blockInit.blockHeight + game.blockInit.blockGap;

    let leftGapX = (game.wall.x - blockXSpacing*cols) / 2;
    let topGapY = 75;

    // populate blocks left of wall
    for (let r=0; r < rows; r++) {
        let blockY = topGapY + r*blockYSpacing;

        for (let c=0; c < cols; c++) {
            let blockX = leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, 
                            game.blockInit.blockWidth, 
                            game.blockInit.blockHeight, 
                            game.blockInit.blockColor[r], 
                            false);
            game.blockInit.blockArray.push(block);
        }
    }
    // populate blocks right of wall
    for (let r=0; r < rows; r++) {
        let blockY = topGapY + r*blockYSpacing;

        for (let c=0; c < cols; c++) {
            let blockX = (game.wall.x + game.wall.width) + leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, 
                            game.blockInit.blockWidth, 
                            game.blockInit.blockHeight, 
                            game.blockInit.blockColor[r], 
                            false);
            game.blockInit.blockArray.push(block);
        }
    }

    randomlyAssignPickupsToBlocks();
    return game.blockInit.blockArray;
}

function createLevel4Layout() {
    let rows = 9;
    let cols = 1;
    let colsMax = 9;
    
    let rowsBreakable = 1;
    let colsBreakable = 10;

    // create right-angled triangle of blocks (stacked left)
    for (let r=0; r < rows; r++) {
        let blockYSpacing = game.blockInit.blockHeight + game.blockInit.blockGap;
        let blockY = blockYSpacing + r*blockYSpacing;

        for (let c=0; c < cols; c++) {
            let blockXSpacing = game.blockInit.blockWidth + game.blockInit.blockGap;
            let leftGapX = (game.canvas.w - blockXSpacing*(colsMax+1)) / 2; // 10 cols fit across the canvas width with these block dimensions
            let blockX = leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, 
                            game.blockInit.blockWidth, 
                            game.blockInit.blockHeight, 
                            game.blockInit.blockColor[r], 
                            false);
            game.blockInit.blockArray.push(block);
        }

        // increment max columns per row to create triangle shape
        if (cols !== colsMax) { cols++; }
    }

    // create row of breakable blocks
    for (let r=0; r < rowsBreakable; r++) {
        let blockYSpacing = game.blockInit.blockHeight + game.blockInit.blockGap;
        let blockY = blockYSpacing + blockYSpacing*rows;

        for (let c=0; c < colsBreakable; c++) {
            let blockXSpacing = game.blockInit.blockWidth + game.blockInit.blockGap;
            let leftGapX = (game.canvas.w - blockXSpacing*colsBreakable) / 2;
            let blockX = leftGapX + c*blockXSpacing;

            if (c === colsBreakable-1) {
                var block = new Block(blockX, blockY, 
                                game.blockInit.blockWidth, 
                                game.blockInit.blockHeight, 
                                'white', false); // special end block
            } else {
                var block = new Block(blockX, blockY, 
                                game.blockInit.blockWidth, 
                                game.blockInit.blockHeight, 
                                game.blockInit.breakableBlockColor[game.blockInit.breakableBlockColor.length-1], 
                                true);
            }
            game.blockInit.blockArray.push(block);
        }
    }

    randomlyAssignPickupsToBlocks();
    return game.blockInit.blockArray;
}

function createLevel5Layout() {
    let rows = 8;
    let cols = 4;

    let rowsBreakable = 2;
    let colsBreakable = 4;

    let blockYSpacing = game.blockInit.blockHeight + game.blockInit.blockGap;
    let topGapY = 50;

    let blockXSpacing = game.blockInit.blockWidth + game.blockInit.blockGap;
    let leftGapX = (game.wall.x - blockXSpacing*cols) / 2;

    // populate regular blocks left of wall
    for (let r=0; r < rows; r++) {
        let topGapY = 50 + blockYSpacing;
        let blockY = topGapY + r*blockYSpacing;

        for (let c=0; c < cols; c++) {
            let blockX = leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, 
                            game.blockInit.blockWidth, 
                            game.blockInit.blockHeight, 
                            game.blockInit.blockColor[r], 
                            false);
            game.blockInit.blockArray.push(block);
        }
    }

    // create 2 rows of breakable blocks left of wall above and below regular blocks
    for (let r=0; r < rowsBreakable; r++) {
        let blockY;

        if (r === 0) { blockY = topGapY; }
        else         { blockY = topGapY + (rows+1)*blockYSpacing; }

        for (let c=0; c < colsBreakable; c++) {
            let blockX = leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, 
                            game.blockInit.blockWidth, 
                            game.blockInit.blockHeight, 
                            game.blockInit.breakableBlockColor[game.blockInit.breakableBlockColor.length-1], 
                            true);
            game.blockInit.blockArray.push(block);
        }
    }

    // populate regular blocks right of wall
    for (let r=0; r < rows; r++) {
        let topGapY = 50 + blockYSpacing;
        let blockY = topGapY + r*blockYSpacing;

        for (let c=0; c < cols; c++) {
            let blockX = (game.wall.x + game.wall.width) + leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, 
                            game.blockInit.blockWidth, 
                            game.blockInit.blockHeight, 
                            game.blockInit.blockColor[r], 
                            false);
            game.blockInit.blockArray.push(block);
        }
    }

    // create 2 rows of breakable blocks right of wall above and below regular blocks
    for (let r=0; r < rowsBreakable; r++) {
        let blockY;

        if (r === 0) { blockY = topGapY; }
        else         { blockY = topGapY + (rows+1)*blockYSpacing; }

        for (let c=0; c < colsBreakable; c++) {
            let blockX = (game.wall.x + game.wall.width) + leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, 
                            game.blockInit.blockWidth, 
                            game.blockInit.blockHeight, 
                            game.blockInit.breakableBlockColor[game.blockInit.breakableBlockColor.length-1], 
                            true);
            game.blockInit.blockArray.push(block);
        }
    }

    randomlyAssignPickupsToBlocks();
    return game.blockInit.blockArray;
}