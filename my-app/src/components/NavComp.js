import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';


const NavComp = () => (
    <>
        <Nav activeKey="/home">
            <Nav.Item>
            <Nav.Link href="/home">
                    <Link to="/">
                        Home
                    </Link>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link ><Link to="/chat">Chat</Link></Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link><Link to="/about">About</Link></Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link>
                <Link to="/map">Map</Link>
            </Nav.Link>
            </Nav.Item>
        </Nav>
  </>
);

export default NavComp;