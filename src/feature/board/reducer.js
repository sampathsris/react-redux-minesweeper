
const DEFAULT_ROWS = 10
const DEFAULT_COLUMNS = 10
const BOMB_THRESHOLD = 0.85

const defaultCell = {
    hasBomb: false,
    exploded: false,
    collapsed: false,
    marked: ' ',
}

const initialState = initDefault()

function initDefault() {
    return {
        rows: DEFAULT_ROWS,
        columns: DEFAULT_COLUMNS,
        populated: false,
        cells: createCells(DEFAULT_ROWS, DEFAULT_COLUMNS)
    };
}

function createCells(rows, columns) {
    let cells = []

    for (let i = 0; i < rows * columns; i++) {
        let cell = defaultCell

        cells.push(cell)
    }

    return cells
}

function getNeighborIndexes({rows, columns}, index) {
    let neighbors = []

    let notLeftEdge = (index % rows) !== 0
    let notRightEdge = (index % rows) !== (rows - 1)
    let notTopEdge = (index > columns)
    let notBottomEdge = (index < rows * columns - columns)

    if (notLeftEdge && notTopEdge)     { neighbors.push(index - columns - 1) }
    if (notTopEdge)                    { neighbors.push(index - columns    ) }
    if (notRightEdge && notTopEdge)    { neighbors.push(index - columns + 1) }
    if (notLeftEdge)                   { neighbors.push(index - 1          ) }
    if (notRightEdge)                  { neighbors.push(index + 1          ) }
    if (notLeftEdge && notBottomEdge)  { neighbors.push(index + columns - 1) }
    if (notBottomEdge)                 { neighbors.push(index + columns    ) }
    if (notRightEdge && notBottomEdge) { neighbors.push(index + columns + 1) }

    return neighbors
}

export function getBombCounts(state) {
    let {cells} = state
    let counts = (new Array(cells.length)).fill(0)

    cells.forEach((cell, index) => {
        if (cell.hasBomb) {
            getNeighborIndexes(state, index).forEach(neighborIndex => counts[neighborIndex]++)
        }
    })

    return counts
}

export default function boardReducer(state = initialState, action) {
    switch (action.type) {
        case 'COLLAPSE_CELL':
            let nextState = changeCell(state, action, collapseCell)

            if (!state.populated) {
                nextState = plantBombs(nextState)
            }

            if (nextState.cells[action.index].exploded) {
                nextState = collapseBoard(nextState)
            }

            nextState = searchAndCollapseSafeCells(nextState, action.index)
            
            return nextState

        case 'EXPLODE_CELL':
            return changeCell(state, action, explodeCell)

        case 'TOGGLE_MARK_CELL':
            return changeCell(state, action, cell => {
                if (cell.collapsed) {
                    return cell
                }

                return {
                    ...cell,
                    marked: getNextMark(cell.marked)
                }
            })

        case 'COLLAPSE_BOARD':
            return collapseBoard(state)

        case 'RESET_BOARD':
            return resetBoard(state)

        default:
            return state;
    }
}

function changeCell(state, action, cellHandler) {
    let { index } = action
    let cell = state.cells[index]
    let newCell = cellHandler(cell)

    if (cell === newCell) {
        return state
    }

    return {
        ...state,
        cells:
            state.cells.slice(0, index)
            .concat([newCell])
            .concat(state.cells.slice(index + 1))
    }
}

function changeCells(state, cellHandler) {
    return {
        ...state,
        cells: state.cells.map(cellHandler)
    }
}

function searchAndCollapseSafeCells(state, startIndex) {
    let bombCounts = getBombCounts(state)
    let toBeCollapsed = []

    if (bombCounts[startIndex] !== 0) {
        return state
    }

    function recursiveSearch(index) {
        let nextBatch = []

        getNeighborIndexes(state, index).forEach(neighborIndex => {
            let cell = state.cells[neighborIndex]
            
            if (toBeCollapsed.indexOf(neighborIndex) < 0 &&
                !cell.collapsed && !cell.hasBomb)
            {
                if (bombCounts[neighborIndex] === 0) {
                    nextBatch.push(neighborIndex)
                }

                toBeCollapsed.push(neighborIndex)
            }
        })

        nextBatch.forEach(recursiveSearch)
    }

    recursiveSearch(startIndex)

    return changeCells(state, (cell, index) => {
        if (toBeCollapsed.indexOf(index) >= 0) {
            return {
                ...cell,
                collapsed: true
            }
        } else {
            return cell
        }
    })
}

function plantBombs(state) {
    let nextCells = state.cells.map(cell => {
        if (cell.collapsed) {
            return cell
        }

        let p = Math.random()

        return {
            ...cell,
            hasBomb: p > BOMB_THRESHOLD
        }
    })

    let nextState = {
        ...state,
        populated: true,
        cells: nextCells,
    }

    return nextState
}

function collapseBoard(state) {
    return {
        ...state,
        cells: state.cells.map(cell => ({
            ...cell,
            collapsed: true
        }))
    }
}

function getNextMark(mark) {
    switch (mark) {
        case ' ': return '🚩'
        case '🚩': return '❓'
        case '❓': return ' '
        default: return ' '
    }
}

function collapseCell(cell) {
    if (cell.collapsed) {
        return cell
    }

    let nextCell = {
        ...cell,
        collapsed: true
    }

    if (nextCell.hasBomb) {
        nextCell = explodeCell(nextCell)
    }

    return nextCell
}

function explodeCell(cell) {
    if (cell.exploded) {
        return cell
    }

    let nextCell = {
        ...cell,
        exploded: true
    }

    return nextCell
}

function resetBoard(state) {
    return {
        ...changeCells(state, () => defaultCell),
        populated: false
    }
}