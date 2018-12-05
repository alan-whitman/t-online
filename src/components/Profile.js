import React, { Component } from 'react';
import Scores from './Scores';

class Profile extends Component {
    render() {
        return (
            <div className="Profile">
                <h2>Your Profile</h2>
                <hr />
                {this.props.isLoggedIn ?
                    <div>
                        <h3>Multiplayer Rating: {this.props.user.rating}</h3>
                        <h3>Singleplayer Game History</h3>
                        <Scores fromProfile={true} user={this.props.user} isLoggedIn={this.props.isLoggedIn} />
                    </div>
                :
                    <h3>Please log in to see your profile.</h3>
                }
            </div>
        )
    }
}

export default Profile;