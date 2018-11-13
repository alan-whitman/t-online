import React, { Component } from 'react';
import './reset.css';
import './App.css';
import Board from './components/Board';

class App extends Component {
  // constructor() {
  //   super();
  // }
  render() {
    return (
      <div className="App">
        <Board />
      </div>
    );
  }
}

export default App;
