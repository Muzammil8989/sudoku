const newGrid = (size) => {
    let arr = new Array(size);

    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size);
    }

    for (let i = 0; i < Math.pow(size, 2); i++) {
        arr[Math.floor(i / size)][i % size] = CONSTANT.UNASSIGNED;
    }
    return arr;
}

// check dubplicate number in column
const checkColumn = (grid, col, num) => {
    for (let row = 0;  row < CONSTANT.GRID_SIZE; row++) {
        if (grid[row][col] === num) return false;
    }
    return true;
}

// check dubplicate number in row
const checkRow = (grid, row, num) => {
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
        if (grid[row][col] === num) return false;
    }
    return true;
}

// check dubplicate number in 3x3 box

const checkBox = (grid, startRow, startCol, num) => {
    for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
        for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
            if(grid[startRow + row][startCol + col] === num) return false;
        }
    }
    return true;
}


// check in row col and 3x3 box
const check = (grid, row, col, num) => {
    return checkRow(grid, row, num) && checkColumn(grid, col, num) && checkBox(grid, row - row % 3, col - col % 3, num) && num !== CONSTANT.UNASSIGNED;
}

// find unassigned cell

const findUnassigned = (grid,pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANT.UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
}

// shuffle the grid
// shuffle the grid
const shuffleGrid = (arr) => {
    let curr_index = arr.length;
    
    while (curr_index !== 0) {
        let random_index = Math.floor(Math.random() * curr_index);
        curr_index--;

        let temp = arr[curr_index];
        arr[curr_index] = arr[random_index];
        arr[random_index] = temp;
    }
    return arr;
}


//check if the puzzle is solved
const isSolved = (grid) => {
    return grid.every((row, index) => {
        return row.every((value, index) => {
            return value !== CONSTANT.UNASSIGNED;
        });
    });
}

// sudoku create
const sudokuCreate =  (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    } 
    if (!findUnassigned(grid, unassigned_pos)) return true;

    let number_list = shuffleGrid([...CONSTANT.NUMBERS]);

    let row = unassigned_pos.row;
    let col = unassigned_pos.col;

    number_list.forEach((num,i) => {
        if (check(grid, row, col, num)) {
            grid[row][col] = num;

            if (isSolved(grid)){
                return true;
            } else{
                if (sudokuCreate(grid)) {
                    return true;
                }
            }
            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    })
    return isSolved(grid);
}

const sudokuCheck = (grid) => {
      let unassigned_pos = {
        row: -1,
        col: -1
    } 
    if (!findUnassigned(grid, unassigned_pos)) return true;

    grid.forEach((row,i) => {
        row.forEach((num,j) => {
            if (check(grid, i, j, num)) {
                if (isSolved(grid)){
                    return true;
                } else {
                    if (sudokuCheck(grid)) {
                        return true;
                    }
                }
            }
        });
    });

    return isSolved(grid);
}

const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

const removeCells = (grid,level) => {
    let res = [...grid];
    let attempts = level;
    while (attempts > 0) {
        let row = rand();
        let col = rand();
        while(grid[row][col] === 0){
            row = rand();
            col = rand();
        }
        res[row][col] = CONSTANT.UNASSIGNED;
        attempts--;
    }
    return res;
}
// generate sudkou base on level
const generateSudoku = (level) => {
    let grid = newGrid(CONSTANT.GRID_SIZE);
    let res = sudokuCreate(grid);
    if (res) {
        let question =  removeCells(grid, level);
        return {
            original : grid,
            question : question
        }
    }
    return undefined;
}

