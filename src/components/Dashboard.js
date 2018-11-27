import React, { Component } from 'react';
import DashboardNav from './DashboardNav';
import Board from './Board';
import Scores from './Scores';
import Leaderboard from './Leaderboard';
import './Dashboard.css';
import { Switch, Route } from 'react-router-dom';

class Dashboard extends Component {
    render() {
        return (
            <div className="Dashboard">
                <DashboardNav username={this.props.user.username} />
                <div className="content-area">
                    <Switch>
                        <Route path="/leaderboard" exact component={Leaderboard} />
                        <Route path="/sp" exact render={(props) => <Board {...props} isLoggedIn={this.props.isLoggedIn} />} />
                        <Route path="/scores/:username" render={(props) => <Scores {...props} isLoggedIn={this.props.isLoggedIn} />} />
                        <Route path="/scores" render={(props) => <Scores {...props} isLoggedIn={this.props.isLoggedIn} />} />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default Dashboard;