import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

const styles = {
    color: "white",
}


const NavComp = () => (
    <>
    <Navbar bg='dark' variant='dark' className="justify-content-center">
        <Nav activeKey="/home">
            <Nav.Link href="/home"><Link to="/" className=''><h4 style={styles}>Home</h4></Link></Nav.Link>
            <Nav.Link><Link to="/map"><h4 style={styles}>Map</h4></Link></Nav.Link>
            <Nav.Link><Link to="/student-list"><h4 style={styles}>Students</h4></Link></Nav.Link>
            <Nav.Link><Link to="/create"><h4 style={styles}>Sign-Up</h4></Link></Nav.Link>
            <Nav.Link><Link to="/about"><h4 style={styles}>About</h4></Link></Nav.Link>
        </Nav>
    </Navbar>
  </>
);

export default NavComp;