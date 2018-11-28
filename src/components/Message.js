import React from 'react';
import './Message.css';

const Message = (props) => {
    return (
        <p className="Message">{props.message}</p>
    )

}

export default Message;