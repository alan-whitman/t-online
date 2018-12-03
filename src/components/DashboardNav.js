import React from 'react';
import './DashboardNav.css';
import { Link } from 'react-router-dom';

const DashboardNav = (props) => {
    return (
        <div className="DashboardNav">
                <Link to="/scores">Profile</Link>
                <Link to="/sp">Play Singleplayer</Link>
                <Link to="/mp">Play Multiplayer</Link>
                <Link to="/spleaderboard">SP Leaderboard</Link>
                <Link to="/mpleaderboard">MP Leaderboard</Link>
                <Link to="/settings">Settings</Link>
        </div>
    )
}

export default DashboardNav;