import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Rankings.css';
import axios from 'axios';

class Rankings extends Component {
    constructor() {
        super();
        this.state = {
            rankings: []
        }
    }
    componentDidMount() {
        axios.get('/mp/rankings').then(res => {
            let rankings = res.data.map((score, i) => {
                return (
                    <div key={i}>
                        <div>{i + 1}</div>
                        <div><Link to={"/scores/" + score.username}>{score.username}</Link></div>
                        <div>{score.rating}</div>
                    </div>
                )
            });
            this.setState({rankings});
        })
    }
    render() {
        return (
            <div className="Rankings">
                <h2>Multiplayer Leaderboard</h2>
                <hr />
                <div className="rankings">
                    <div>
                        <div className="rankings-header">Rank</div>
                        <div className="rankings-header">Username</div>
                        <div className="rankings-header">Rating</div>
                    </div>
                    {this.state.rankings}
                </div>
            </div>
        )
    }
}

export default Rankings;