import React, { Component } from 'react';
import Board from './Board';
import Scores from './Scores';
import Leaderboard from './Leaderboard';
import Rankings from './Rankings';
import Landing from './Landing';
import Settings from './Settings';
import Profile from './Profile';
import TestMail from './TestMail';
import { Switch, Route } from 'react-router-dom';

import './Dashboard.css';


class Dashboard extends Component {

    render() {
        return (
            <div className="Dashboard">
                <div className="content-area">
                    <Switch>
                        <Route path="/testmail" component={TestMail} />
                        <Route path="/spleaderboard" exact component={Leaderboard} />
                        <Route path="/mpleaderboard" component={Rankings} />
                        <Route path="/sp" exact render={(props) => <Board {...props} user={this.props.user} isLoggedIn={this.props.isLoggedIn} settings={this.props.settings} mode={'sp'} key={'sp' + this.props.isLoggedIn} />} />
                        <Route path="/mp" exact render={(props) => <Board {...props} user={this.props.user} isLoggedIn={this.props.isLoggedIn} settings={this.props.settings} mode={'mp'} key={'mp' + this.props.isLoggedIn} />} />
                        <Route path="/profile" render={(props) => <Profile {...props} user={this.props.user} isLoggedIn={this.props.isLoggedIn} />} />
                        <Route path="/scores/:username" render={(props) => <Scores {...props} isLoggedIn={this.props.isLoggedIn} />} />
                        <Route path="/scores" render={(props) => <Scores {...props} isLoggedIn={this.props.isLoggedIn} user={this.props.user} />} />
                        <Route path="/settings" render={(props) => <Settings {...props} isLoggedIn={this.props.isLoggedIn} user={this.props.user} settings={this.props.settings} updateSettings={this.props.updateSettings} deleteAccount={this.props.deleteAccount} />} />
                        <Route path="/" component={Landing} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default Dashboard;