import React, { Component } from 'react';
import DashboardNav from './DashboardNav';
import Board from './Board';
import Scores from './Scores';
import Leaderboard from './Leaderboard';
import './Dashboard.css';
import { Switch, Route, Link } from 'react-router-dom';

class Dashboard extends Component {
    render() {
        return (
            <div className="Dashboard">
                <DashboardNav />
                <div className="content-area">
                    <Route path="/leaderboard" exact component={Leaderboard} />
                    <Route path="/sp" exact render={(props) => <Board {...props} isLoggedIn={this.props.isLoggedIn} />} />
                    <Route path="/" exact render={(props) => <Scores {...props} isLoggedIn={this.props.isLoggedIn} id={this.props.user.user_id} />} />
                </div>
            </div>
        )
    }
}

export default Dashboard;