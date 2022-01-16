import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
    

            <header className="">
            <nav>
                <ul>
                    <li><Link to="/chat">Chat</Link></li>
                    <li><Link to="/map">Map</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/">Home</Link></li>
                </ul>
            </nav>
            <h1>Study Buddies App</h1>
            </header>
        
    
)

export default Header;