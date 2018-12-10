
import React from 'react'
import {connect} from 'react-redux'

import './styles.css'
import { collapseCellAndFollowThrough, toggleMarkCell } from './actions';

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
    return (
        <td
            className={`board-cell ${collapsed ? 'collapsed' : 'uncollapsed'}`}
            style={{
                cursor
            }}
            onClick={handleMouseEvent(handleClick)}
            onContextMenu={handleMouseEvent(handleRightClick)}
        >
        {
            collapsed ? <CollapsedCellContent {...{hasBomb, exploded, bombCount}} /> : marked
        }
        </td>
    )
}

function BoardRow({
    cellRow, handleClick, handleRightClick
}) {
    return (
        <tr className="board-row">
            {
                cellRow.map(
                    (cell, columnIndex) =>
                        <BoardCell
                            key={columnIndex}
                            {...cell}
                            handleClick={() => handleClick(columnIndex)}
                            handleRightClick={() => handleRightClick(columnIndex)}
                        />
                )
            }
        </tr>
    )
}

function Board({
    cells, handleClick, handleRightClick
}) {
    return (
        <table className="board">
            <tbody>
            {
                cells.map(
                    (cellRow, rowIndex) =>
                        <BoardRow
                            key={rowIndex}
                            cellRow={cellRow}
                            handleClick={columnIndex => handleClick(rowIndex, columnIndex)}
                            handleRightClick={columnIndex => handleRightClick(rowIndex, columnIndex)}
                        />
                )
            }
            </tbody>
        </table>
    )
}

function mapStateToProps(state) {
    return {
        ...state.board
    }
}

export default connect(
    mapStateToProps,
    {
        handleClick: collapseCellAndFollowThrough(mapStateToProps),
        handleRightClick: toggleMarkCell,
    }
)(Board)
