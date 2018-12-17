
export function toggleMarkCell(index) {
    return {
        type: 'TOGGLE_MARK_CELL',
        index,
    }
}

export function collapseCell(index) {
    return {
        type: 'COLLAPSE_CELL',
        index,
    }
}

export function collapseBoard() {
    return {
        type: 'COLLAPSE_BOARD'
    }
}
