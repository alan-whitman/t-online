import React, { Component } from 'react';
import './reset.css';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard'
import axios from 'axios';
import { Spring } from 'react-spring';
import { withRouter } from 'react-router-dom';

class App extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: false,
            user: {},
            authError: '',
            settingsMsg: '',
            showMenu: true,
            loading: true,
            settings: {
                left: 'ArrowLeft',
                right: 'ArrowRight',
                down: 'ArrowDown',
                rotateClockwise: 'x',
                rotateCounterClockwise: 'z',
                hardDrop: 'ArrowUp',
                holdPiece: 'c',
                pause: 'Space',
                blockScale: 21
            }
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.register = this.register.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.updateVerificationStatus = this.updateVerificationStatus.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updateBlockScale = this.updateBlockScale.bind(this);
    }
    componentDidMount() {
        axios.get('/auth/current_user').then(res => {
            if (res.data.settings)
                this.setState({settings: {...this.state.settings, left: res.data.settings.moveleft, right: res.data.settings.moveright, down: res.data.settings.movedown, rotateClockwise: res.data.settings.rotateclockwise, rotateCounterClockwise: res.data.settings.rotatecounterclockwise, hardDrop: res.data.settings.harddrop, holdPiece: res.data.settings.holdpiece, pause: res.data.settings.pause, blockScale: res.data.settings.blockscale}});
            if (res.data.user)  {
                this.setState({user: res.data.user, isLoggedIn: true, loading: false});
            } else {
                this.setState({loading: false});
            }
            
        }).catch(err => {console.log(err); this.setState({loading: false})});
    }
    logout() {
        axios.get('/auth/logout').then(res => {
            this.setState({user: {}, isLoggedIn: false, settings: {...this.state.settings, left: 'ArrowLeft', right: 'ArrowRight', down: 'ArrowDown', rotateClockwise: 'x', rotateCounterClockwise: 'z', hardDrop: 'ArrowUp', holdPiece: 'c', pause: 'Space', blockScale: 21}});
        }).catch(err => console.log(err));
        
    }
    login(username, password) {
        if (username.trim() === '' || password.trim() === '')
            return this.setState({authError: 'Please enter a username and password'});
        axios.post('/auth/login', {username, password}).then(res => {
            if (res.data.settings)
                this.setState({settings: {...this.state.settings, left: res.data.settings.moveleft, right: res.data.settings.moveright, down: res.data.settings.movedown, rotateClockwise: res.data.settings.rotateclockwise, rotateCounterClockwise: res.data.settings.rotatecounterclockwise, hardDrop: res.data.settings.harddrop, holdPiece: res.data.settings.holdpiece, pause: res.data.settings.pause, blockScale: res.data.settings.blockscale}});
            this.setState({user: res.data.user, isLoggedIn: true, authError: ''})
        }).catch(err => this.setState({authError: err.response.data}));
    }
    register(username, email, password) {
        if (username.trim() === '' || password.trim() === '' || email.trim() === '')
            return this.setState({authError: 'Registration requires a username, password, and email address'});
        axios.post('/auth/register', {username, email, password}).then(res => {
            this.setState({user: res.data, isLoggedIn: true, authError: ''}, this.props.history.push('/register'));
        }).catch(err => this.setState({authError: err.response.data}));
    }
    updateSettings(newSettings) {
        newSettings.blockScale = this.state.settings.blockScale;
        this.setState({settings: newSettings});
        if (this.state.isLoggedIn)
            axios.post('/settings/update', newSettings).catch(err => console.error(err));
    }
    toggleMenu() {
        this.setState({showMenu: !this.state.showMenu});
    }
    deleteAccount() {
        axios.delete('/auth/delete_account').then(res => {
            this.setState({user: {}, isLoggedIn: false, settings: {...this.state.settings, left: 'ArrowLeft', right: 'ArrowRight', down: 'ArrowDown', rotateClockwise: 'x', rotateCounterClockwise: 'z', hardDrop: 'ArrowUp', holdPiece: 'c', pause: 'Space', blockScale: 21}}, () => this.props.history.push('/'));
        }).catch(err => console.error(err));
    }
    resendVerification() {
        axios.get('/auth/resend_verification').catch(err => console.error(err));
    }
    updateEmail(newEmail) {
        axios.put('/auth/update_email', {newEmail}).then(res => {
            this.setState({settingsMsg: 'Email address updated, please check for a new verification email', user: res.data});
        }).catch(err => this.setState({settingsMsg: err.response.data}));
    }
    updateVerificationStatus() {
        if (this.state.isLoggedIn)
            return this.setState({user: {...this.state.user, verified: true}});
    }
    updateBlockScale(newBlockScale) {
        this.setState({settings: {...this.state.settings, blockScale: newBlockScale}});
        if (this.state.isLoggedIn) {
            axios.post('/settings/blockscale', {newBlockScale}).then(res => {

            }).catch(err => console.error(err));
        }
    }
    render() {
        const ptv = this.state.showMenu ? 80 : 40;
        return (
            <Spring
                from={{paddingTop: ptv}}
                to={{paddingTop: ptv}}
                config={{friction: 2, tension: 210, clamp: true}}
            >
                {props => <div style={props} className="App">
                    <Header 
                        isLoggedIn={this.state.isLoggedIn}
                        user={this.state.user}
                        login={this.login}
                        logout={this.logout}
                        register={this.register}
                        authError={this.state.authError}
                        showMenu={this.state.showMenu}
                        toggleMenu={this.toggleMenu}
                    />
                    <Dashboard
                        user={this.state.user}
                        isLoggedIn={this.state.isLoggedIn}
                        showMenu={this.state.showMenu}
                        settings={this.state.settings}
                        updateSettings={this.updateSettings}
                        key={this.state.isLoggedIn}
                        deleteAccount={this.deleteAccount}
                        resendVerification={this.resendVerification}
                        updateEmail={this.updateEmail}
                        loading={this.state.loading}
                        updateVerificationStatus={this.updateVerificationStatus}
                        settingsMsg={this.state.settingsMsg}
                        logout={this.logout}
                        updateBlockScale={this.updateBlockScale}
                    />
                </div>}
            </Spring>
        );
    }
}

export default withRouter(App);
