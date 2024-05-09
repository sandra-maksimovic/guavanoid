function createLevel1Layout(blockArray, blockGap, blockWidth, blockHeight, canvas) {
    let color = 'grey';
    let health = 1;
    
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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color, health);
            blockArray.push(block);
        }
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

            // use row num as basis for spacing top horizontally
            if (r !== 0 && colsMax === rows) {
                blockX = (blockX - blockXSpacing*r) + c*blockXSpacing;
            // halve max cols then use whole portion as basis for spacing bottom horizontally
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
    
    let colorBreakableDark = 'rgb(51, 26, 0)'; // dark brown
    //let colorBreakableMed = 'rgb(102, 53, 0)'; // brown
    //let colorBreakableLight = 'rgb(153, 79, 0)'; // light brown
    let healthBreakable = 3;
    let rowsBreakable = 1;
    let colsBreakable = 10;

    // create right-angled triangle of blocks (stacked left)
    for (let r=0; r < rows; r++) {
        let blockY;
        let blockYSpacing = blockHeight + blockGap;
        //let topGapY = 50;

        if (r === 0) {
            blockY = blockYSpacing;
        } else {
            blockY = blockYSpacing + r*blockYSpacing;
        }

        for (let c=0; c < cols; c++) {
            let blockX;
            let blockXSpacing = blockWidth + blockGap;
            let leftGapX = (canvas.w - blockXSpacing*(colsMax+1)) / 2;

            blockX = leftGapX + c*blockXSpacing;

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color, health);
            blockArray.push(block);
        }

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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, colorBreakableDark, healthBreakable);
            blockArray.push(block);
        }
    }

    return blockArray;
}