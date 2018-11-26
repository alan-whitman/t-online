import React, { Component } from 'react';
import axios from 'axios';

class Scores extends Component {
    constructor() {
        super();
        this.state = {
            scores: []
        }
    }
    getScores() {
        axios.get('/sp/get_scores').then(res => {
            const scores = res.data.map((score, i) => {
                return <div key={i}>Score: {score.score}</div>
            });
            return this.setState({scores});
        });
    }
    componentDidMount() {
        if (this.props.isLoggedIn)
            this.getScores();
    }
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && this.props.isLoggedIn)
            this.getScores();
    }
    render() {
        return (
            <div>
                <h3>Past Scores</h3>
                {this.props.isLoggedIn ? this.state.scores : null}
            </div>
        )
    }
}

export default Scores;