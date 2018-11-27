import React, { Component } from 'react';
import './Scores.css';
import axios from 'axios';

class Scores extends Component {
    constructor() {
        super();
        this.state = {
            scores: []
        }
    }
    getScores() {
        let getString = '/sp/get_scores';
        getString += this.props.match.params.username ? '/' + this.props.match.params.username : ''
        axios.get(getString).then(res => {
            const scores = res.data.map((score, i) => {
                return (
                    <div key={i}>
                        <div>{score.score}</div>
                        <div>{score.date}</div>
                    </div>
                )
            });
            return this.setState({scores});
        });
    }
    componentDidMount() {
        this.getScores();
    }
    componentDidUpdate(prevProps) {
        if (this.props.match.params.username !== prevProps.match.params.username)
            this.getScores();
    }
    render() {
        let userMessage;
        if (!this.props.isLoggedIn && !this.props.match.params.username)
            userMessage = 'Please login or a visit another user\'s history page to see a game history';
        else if (this.props.match.params.username)
            userMessage = this.props.match.params.username;
        return (
            <div className="Scores">
                <h2>Past Games</h2>
                <hr />
                <h3>{userMessage}</h3>
                <div className="scores">
                    <div>
                        <div className="scores-header">Score</div>
                        <div className="scores-header">Played on</div>
                    </div>
                    {this.state.scores[0] ? this.state.scores : 'No scores to display'}
                </div>
            </div>
        )
    }
}

export default Scores;