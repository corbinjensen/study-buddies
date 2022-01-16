import React from 'react';
import { Link } from 'react-router-dom';


const Nav = () => (
    <nav>
        <ul>
            <li><Link to="/chat">Chat</Link></li>
            <li><Link to="/map">Map</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/">Home</Link></li>
        </ul>
    </nav>
);

export default Nav;