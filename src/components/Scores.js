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
        let getString = '/sp/get_scores';
        getString += this.props.match.params.username ? '/' + this.props.match.params.username : ''
        axios.get(getString).then(res => {
            const scores = res.data.map((score, i) => {
                return <div key={i}>Score: {score.score}, played on {score.date}</div>
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
        return (
            <div>
                <h3>Past Games</h3>
                {this.props.isLoggedIn ? this.state.scores : null}
            </div>
        )
    }
}

export default Scores;