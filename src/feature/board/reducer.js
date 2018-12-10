
const initialState = (function () {
    let state = {
        rows: 10,
        columns: 10,
        bombs: 0,
        cells: []
    }
    
    const BOMB_THRESHOLD = 0.7
    state.cells = createCells(state.rows, state.columns, BOMB_THRESHOLD)

    return state;
})()

function createCells(rows, columns, thresholdProbability) {
    let cells = []

    for (let i = 0; i < rows; i++) {
        let row = []

        for (let j = 0; j < columns; j++) {
            let p = Math.random()
            let cell = {
                hasBomb: p > thresholdProbability,
                exploded: false,
                collapsed: false,
                marked: ' ',
            }

            row.push(cell)
        }

        cells.push(row)
    }

    setCellNeighbors(cells)

    return cells
}

function setCellNeighbors(cells) {
    function getNeighborDescription(rowIndex, columnIndex) {
        if (rowIndex < 0 || rowIndex >= cells.length ||
            columnIndex < 0 || columnIndex >= cells[0].length)
        {
            return undefined
        }

        let cell = cells[rowIndex][columnIndex]

        return {
            rowIndex, columnIndex, cell
        }
    }

    for (let i = 0; i < cells.length; i++) {
        let up = i - 1
        let down = i + 1
        let mid = i

        for (let j = 0; j < cells[i].length; j++) {
            let cell = cells[i][j]
            let left = j - 1
            let right = j + 1
            let center = j

            let neighbors = {
                nw: getNeighborDescription(up, left),
                n:  getNeighborDescription(up, center),
                ne: getNeighborDescription(up, right),
                w:  getNeighborDescription(mid, left),
                e:  getNeighborDescription(mid, right),
                sw: getNeighborDescription(down, left),
                s:  getNeighborDescription(down, center),
                se: getNeighborDescription(down, right),
            }

            let bombCount = 0

            Object.keys(neighbors).forEach(key => {
                if (neighbors[key] && neighbors[key].cell.hasBomb) {
                    bombCount++
                }
            })

            cell.neighbors = neighbors
            cell.bombCount = bombCount
        }
    }
}

function handleCellChange(state, action, cellHandler) {
    let { rowIndex ,columnIndex } = action
    let cellRow = state.cells[rowIndex]
    let cell = cellRow[columnIndex]
    let newCell = cellHandler(cell)

    if (cell === newCell) {
        return state
    }

    return {
        ...state,
        cells:
            state.cells.slice(0, rowIndex)
            .concat([
                cellRow.slice(0, columnIndex)
                    .concat([newCell])
                    .concat(cellRow.slice(columnIndex + 1))
            ])
            .concat(state.cells.slice(rowIndex + 1))
    }
}

function collapseBoard(state) {
    return {
        ...state,
        cells: state.cells.map(row =>
            row.map(cell => ({
                ...cell,
                collapsed: true
            })))
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

export default function boardReducer(state = initialState, action) {
    switch (action.type) {
        case 'COLLAPSE_CELL':
            return handleCellChange(state, action, cell => {
                if (cell.collapsed) {
                    return cell
                }

                return {
                    ...cell,
                    collapsed: true
                }
            })
        case 'EXPLODE_CELL':
            return handleCellChange(state, action, cell => {
                return {
                    ...cell,
                    exploded: true
                }
            })
        case 'TOGGLE_MARK_CELL':
            return handleCellChange(state, action, cell => {
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
        default:
            return state;
    }
}
