import React, { Component } from 'react';
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
            const scores = res.data.map((score, i) => {
                return <div key={i}>{score.username}: {score.score}</div>
            });
            this.setState({leaderboard: scores});
        })
    }
    render() {
        return (
            <div>
                {this.state.leaderboard}
            </div>
        )
    }
}

export default Leaderboard;