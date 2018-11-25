import React, { Component } from 'react';
import './reset.css';
import './App.css';
import Board from './components/Board';
import Header from './components/Header';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      user: {}
    }
    this.login = this.login.bind(this);
  }
  login(username, password) {
    axios.post('/auth/login', {username, password}).then(res => {
      console.log(res.data);
      this.setState({user: res.data, isLoggedIn: true})
    }).catch(err => console.log(err));
  }
  render() {
    return (
      <div className="App">
        <Header 
          isLoggedIn={this.state.isLoggedIn}
          user={this.state.user}
          login={this.login}
        />
        <Board />
      </div>
    );
  }
}

export default App;
