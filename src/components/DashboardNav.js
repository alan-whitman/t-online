import React from 'react';
import './DashboardNav.css';
import { Link } from 'react-router-dom';


const DashboardNav = (props) => {
    // const user = props.username ? '/' + props.username : '';
    return (
        <div className="DashboardNav">
            <div>
                <Link to={"/scores"}>Profile</Link>
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
            <div>
                <Link to="/rankings">MP Leaderboard</Link>
            </div>
            <div>
                <Link to="/settings">Settings</Link>
            </div>
        </div>
    )
}

export default DashboardNav;