
import React from 'react'
import {connect} from 'react-redux'

import './styles.css'
import { toggleMarkCell, collapseCell } from './actions';
import { getBombCounts } from './reducer';

const handleMouseEvent = (fn) => e => {
    e.preventDefault()
    fn()
}

function getBombCountColor(bombCount) {
    switch (bombCount) {
        case 1: return 'grey'
        case 2: return 'navy'
        case 3: return 'blue'
        case 4: return 'green'
        case 5: return 'gold'
        case 6: return 'orange'
        case 7: return 'red'
        case 8: return 'brown'
        default: return ''
    }
}

function CollapsedCellContent({
    hasBomb, exploded, bombCount
}) {
    return (
        hasBomb
            ? <span>
              {exploded ? '💥' : '💣'}
              </span>
            : <span style={{color: getBombCountColor(bombCount)}}>
              {bombCount === 0 ? '' : bombCount}
              </span>
    )
}

function BoardCell({
    hasBomb, exploded, collapsed, marked, bombCount,
    handleClick, handleRightClick
}) {
    let cursor = (!collapsed) || (collapsed && hasBomb && (!exploded))
        ? 'pointer' : 'default'
    let className = `board-cell ${collapsed ? 'collapsed' : 'uncollapsed'}`
    
    return (
        <td
            className={className}
            style={{ cursor }}
            onClick={handleMouseEvent(handleClick)}
            onContextMenu={handleMouseEvent(handleRightClick)}
        >
        {
            collapsed
                ? <CollapsedCellContent {...{hasBomb, exploded, bombCount}} />
                : marked
        }
        </td>
    )
}

function Board({
    rows, columns, cells, handleClick, handleRightClick
}) {    
    let cellRows = []

    for (let i = 0; i < rows; i++) {
        let cellRow = []

        for (let j = 0; j < columns; j++) {
            let index = i * rows + j
            cellRow.push(
                <BoardCell key={j}
                    {...cells[index]}
                    handleClick={() => handleClick(index)}
                    handleRightClick={() => handleRightClick(index)}
                />
            )
        }

        cellRows.push(<tr key={i}>{cellRow}</tr>)
    }

    return (
        <table className="board">
            <tbody>{cellRows}</tbody>
        </table>
    )
}

function mapStateToProps(state) {
    let bombCounts = getBombCounts(state.board)

    return {
        ...state.board,
        cells: state.board.cells.map((cell, index) => ({
            ...cell,
            bombCount: bombCounts[index],
        }))
    }
}

export default connect(
    mapStateToProps,
    {
        handleClick: collapseCell,
        handleRightClick: toggleMarkCell,
    }
)(Board)
