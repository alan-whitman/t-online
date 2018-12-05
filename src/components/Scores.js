import React, { Component } from 'react';
import './Scores.css';
import axios from 'axios';

class Scores extends Component {
    constructor() {
        super();
        this.state = {
            scores: [],
            rating: 0
        }
    }
    getScores() {
        let getString = '/sp/get_scores';
        if (this.props.match)
            getString += this.props.match.params.username ? '/' + this.props.match.params.username : ''
        else if (this.props.user)
            getString += '/' + this.props.user.username
        else
            return;
        axios.get(getString).then(res => {
            const scores = res.data.scores.map((score, i) => {
                return (
                    <div key={i}>
                        <div>{score.score}</div>
                        <div>{score.date}</div>
                    </div>
                )
            });
            return this.setState({scores, rating: res.data.rating.rating});
        });
    }
    componentDidMount() {
        this.getScores();
    }
    componentDidUpdate(prevProps) {
        if (this.props.match)
            if (this.props.match.params.username !== prevProps.match.params.username || this.props.isLoggedIn !== prevProps.isLoggedIn)
                this.getScores();
    }
    render() {
        let userMessage;
        if (!this.props.match)
            userMessage = '';
        else if (!this.props.isLoggedIn && !this.props.match.params.username)
            userMessage = 'Please login or a visit another user\'s scores page to see a game history';
        else if (this.props.match.params.username)
            userMessage = 'Username: ' + this.props.match.params.username;
        else
            userMessage = 'Username: ' + this.props.user.username;
        return (
            <div className="Scores">
                {!this.props.fromProfile ? <h2>Player Profile</h2> : null}
                {!this.props.fromProfile ? <hr /> : null}
                <h3>{userMessage}</h3>
                {!this.props.fromProfile ? <h3>Multiplayer Rating: {this.state.rating}</h3> : null}
                {!this.props.fromProfile ? <h3>Game History</h3> : null}
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