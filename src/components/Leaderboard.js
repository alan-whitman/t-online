import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Leaderboard.css';
import axios from 'axios';

class Leaderboard extends Component {
    constructor() {
        super();
        this.state = {
            leaderboard: []
        }
    }
    componentDidMount() {
        axios.get('/sp/leaderboard').then(res => {
            let leaderboard = res.data.map((score, i) => {
                return (
                    <div key={i}>
                        <div><Link to={"/scores/" + score.username}>{score.username}</Link></div><div>{score.score}</div><div>{score.date}</div>
                    </div>
                )
            });
            this.setState({leaderboard});
        })
    }
    render() {
        return (
            <div className="Leaderboard">
                <div>
                    <div>Username</div>
                    <div>Score</div>
                    <div>Played on</div>
                </div>
            
                {this.state.leaderboard}
            </div>
        )
    }
}

export default Leaderboard;