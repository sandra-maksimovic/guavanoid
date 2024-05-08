function createLevel1Layout(blockArray, blockGap, blockWidth, blockHeight, canvas) {
    let rows = 6;
    let cols = 10;
    let color = 'grey';
    
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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color);
            blockArray.push(block);
        }
    }

    return blockArray;
}

function createLevel2Layout(blockArray, blockGap, blockWidth, blockHeight, canvas) {
    let rows = 9;
    let cols = 1;
    let colsMax = 9;
    let color = 'blue';
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

            let block = new Block(blockX, blockY, blockWidth, blockHeight, color);
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