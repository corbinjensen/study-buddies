import React from 'react';
import NavComp from './NavComp'

const Header = () => (
            <header className="container-fluid">
                <h1 style={{textAlign:"center"}}>Study Buddy</h1>
                <NavComp />
            </header>
)

export default Header;