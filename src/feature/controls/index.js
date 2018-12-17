
import React from 'react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'

import './styles.css'
import { resetBoard } from './actions';

function Controls({
    resetBoard
}) {
    return (
        <div className="controls">
            <Button variant="outlined" color="secondary" onClick={resetBoard}>
                Reset
            </Button>
        </div>
    )
}

export default connect(
    null,
    {
        resetBoard
    }
)(Controls)
