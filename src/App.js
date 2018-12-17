
import React, { Component } from 'react'
import Board from './feature/board'
import Controls from './feature/controls';
import CssBaseline from '@material-ui/core/CssBaseline'

class App extends Component {
  render() {
    return (
      <>
        <CssBaseline />
        <Board />
        <Controls />
      </>
    )
  }
}

export default App;
