
export const collapseCellAndFollowThrough = mapStateToProps => (rowIndex, columnIndex) => {
    const contexedOwn = collapseCellAndFollowThrough(mapStateToProps)

    return (dispatch, getState) => {
        dispatch(collapseCell(rowIndex, columnIndex))
        
        let currentCell = mapStateToProps(getState()).cells[rowIndex][columnIndex]

        if (currentCell.hasBomb) {
            return dispatch(explodeCellAndFollowThrough(rowIndex, columnIndex))
        }

        Object.keys(currentCell.neighbors).forEach(key => {
            // we will not collapse 
            if (['n', 'e', 's', 'w'].indexOf(key) < 0) {
                return
            }

            let neighbor = currentCell.neighbors[key]

            if (neighbor) {
                // We need to re-get the state. Why? Because a previous iteration
                // of the Object.keys loop could have replaced the cells, but
                // neighbor.cell will still point to the old cell.
                let cell = mapStateToProps(getState())
                    .cells[neighbor.rowIndex][neighbor.columnIndex]

                if (!(cell.hasBomb || cell.collapsed)) {
                    dispatch(contexedOwn(neighbor.rowIndex, neighbor.columnIndex))
                }
            }
        })

        return { type: 'DUMMY' }
    }
}

export const explodeCellAndFollowThrough = (rowIndex, columnIndex) => {
    return (dispatch) => {
        dispatch(explodeCell(rowIndex, columnIndex))
        dispatch(collapseBoard())
    }
}

export function toggleMarkCell(rowIndex, columnIndex) {
    return {
        type: 'TOGGLE_MARK_CELL',
        rowIndex,
        columnIndex,
    }
}

export function collapseCell(rowIndex, columnIndex) {
    return {
        type: 'COLLAPSE_CELL',
        rowIndex,
        columnIndex,
    }
}

export function explodeCell(rowIndex, columnIndex) {
    return {
        type: 'EXPLODE_CELL',
        rowIndex,
        columnIndex
    }
}

export function collapseBoard() {
    return {
        type: 'COLLAPSE_BOARD'
    }
}
