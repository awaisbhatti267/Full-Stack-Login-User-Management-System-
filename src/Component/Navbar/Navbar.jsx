import React from 'react'

import { Link } from 'react-router-dom'

import './navbar.css';


const Navbar = () => {
    return (
        <>
            <nav className="navbar">
                <p className='logo'><Link to='/'>ReactApp</Link></p>
                <ul>
                    <li><Link to='/home'>Home </Link></li>
                    <li><Link to='/about'>About</Link></li>
                    <li>
                        <Link to='/'>Login</Link>
                    </li>
                    <li>
                        <Link to='/signup'>Signup</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar;