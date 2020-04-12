const normalGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
]

// hard sudoku
const hardGrid = [
    [0, 0, 0, 0, 4, 0, 0, 5, 1],
    [0, 5, 0, 0, 0, 8, 0, 0, 3],
    [0, 0, 0, 5, 9, 1, 0, 0, 0],
    [3, 2, 0, 0, 0, 0, 6, 0, 0],
    [1, 0, 0, 0, 2, 0, 0, 0, 4],
    [0, 0, 5, 0, 0, 0, 0, 7, 9],
    [0, 0, 0, 6, 8, 5, 0, 0, 0],
    [5, 0, 0, 7, 0, 0, 0, 4, 0],
    [7, 9, 0, 0, 3, 0, 0, 0, 0],
]

// impossible / wrong grid
const wrongGrid = [
    [0, 0, 0, 0, 4, 0, 0, 5, 5],
    [0, 5, 0, 0, 0, 8, 0, 0, 3],
    [0, 0, 0, 5, 9, 1, 0, 0, 0],
    [3, 2, 0, 0, 0, 0, 6, 0, 0],
    [1, 0, 0, 0, 2, 0, 0, 0, 4],
    [0, 0, 5, 0, 0, 0, 0, 7, 9],
    [0, 0, 0, 6, 8, 5, 0, 0, 0],
    [5, 0, 0, 7, 0, 0, 0, 4, 0],
    [7, 9, 0, 0, 3, 0, 0, 0, 0],
]

// useless...
const row = [0,1,2,3,4,5,6,7,8]
const square = [0,1,2]

const printGrid = function(grid) {
    console.log("");
    for(let y = 0; y < 9; ++y) {
        let row = "[ "
        for(let x = 0; x < 9; ++x) {
            row += grid[y][x] + " "
        }
        row += "]"
        console.log(row)
    }
    console.log("");
}

const isPossible = function(grid, y, x, n) {
    let result = true
    // check row
    row.forEach(i => {
        if (grid[y][i] === n)
            result = false
    })
    // check column
    row.forEach(i => {
        if (grid[i][x] === n)
            result = false
    })

    // check square
    const x0 = Math.floor(x/3) * 3
    const y0 = Math.floor(y/3) * 3

    square.forEach(i => {
        square.forEach(j => {
            if (grid[y0 + i][x0 + j] === n)
                result = false
        })
    })

    return result
}

// console.log(isPossible(4,4,5))
// console.log(isPossible(0,0,5))

const solveGrid = function(grid, sol) {
    for(let y = 0; y < 9; ++y) {
        for(let x = 0; x < 9; ++x) {
            if (grid[y][x] === 0) {
                for(let n = 1; n < 10; ++n) {
                    if (isPossible(grid, y, x, n)) {
                        grid[y][x] = n // ok possible, let's try and move on
                        solveGrid(grid, sol)
                        grid[y][x] = 0 // something was not good, reset to 0 and continue(backtrace)
                    }
                }

                // dead end
                // console.log("fail")
                return
            }
        }
    }
    printGrid(grid)
    
    for(let i = 0; i < 9; ++i) {
        for(let j = 0; j < 9; ++j) {
            sol[i][j] = grid[i][j]
        }
    }
    return sol
}

// solveGrid(normalGrid)
// printGrid(normalGrid)

export { solveGrid }