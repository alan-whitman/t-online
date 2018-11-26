import React from 'react';
import './DashboardNav.css';
import { Link } from 'react-router-dom';


const DashboardNav = (props) => {
    return (
        <div className="DashboardNav">
            <div>
                <Link to="/scores">Your Profile</Link>
            </div>
            <div>
                <Link to="/sp">Play Singleplayer</Link>
            </div>
            <div>
                <Link to="/mp">Play Multiplayer</Link>
            </div>
            <div>
                <Link to="/leaderboard">SP Leaderboard</Link>
            </div>
        </div>
    )
}

export default DashboardNav;