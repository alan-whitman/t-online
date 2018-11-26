import React, { Component } from 'react';
import Board from './Board';
import { Switch, Route, Link } from 'react-router-dom';

class Dashboard extends Component {
    render() {
        return (
            <div className="Dashboard">
                <Switch>
                    <Route path="/sp" exact component={Board} />
                    <Link to="/sp">Play single player</Link>
                </Switch>
            </div>
        )
    }
}

export default Dashboard;