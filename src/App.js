import React, { Component } from 'react';
import './reset.css';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard'
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      user: {},
      authError: ''
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
  }
  componentDidMount() {
    axios.get('/auth/current_user').then(res => {
      if (res.data.username)
        this.setState({user: res.data, isLoggedIn: true})
    }).catch(err => console.log(err));;
  }
  logout() {
    axios.get('/auth/logout').then(res => {
      this.setState({user: {}, isLoggedIn: false});
    }).catch(err => console.log(err));
  }
  login(username, password) {
    if (username.trim() === '' || password.trim() === '')
      return this.setState({authError: 'Please enter a username and password'});
    axios.post('/auth/login', {username, password}).then(res => {
      this.setState({user: res.data, isLoggedIn: true, authError: ''})
    }).catch(err => this.setState({authError: err.response.data}));
  }
  register(username, email, password) {
    if (username.trim() === '' || password.trim() === '' || email.trim() === '')
      return this.setState({authError: 'Registration requires a username, password, and email address'});
    axios.post('/auth/register', {username, email, password}).then(res => {
      this.setState({user: res.data, isLoggedIn: true, authError: ''});
    }).catch(err => this.setState({authError: err.response.data}));
  }
  render() {
    return (
      <div className="App">
        <Header 
          isLoggedIn={this.state.isLoggedIn}
          user={this.state.user}
          login={this.login}
          logout={this.logout}
          register={this.register}
          authError={this.state.authError}
        />
        <Dashboard
          user={this.state.user}
          isLoggedIn={this.state.isLoggedIn}
        />
      </div>
    );
  }
}

export default App;
