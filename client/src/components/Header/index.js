import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../actions";
import './header.scss';

const toggleMenu = (e, toggleFocus) => {
    let toggleItem;
    
    if (toggleFocus === 'mainNav') {
        toggleItem = document.querySelector('.nav-menu');
    } else if (toggleFocus === 'navSubItem') {
        toggleItem = e.currentTarget.querySelector('.submenu');
    }

    if (toggleItem.classList.contains('active')) {
        toggleItem.classList.remove('active');
    }
    else {
        toggleItem.classList.add('active');
    }
}
const authNavItems = (dispatch, isAuthenticated) => {

    const authNavValues = isAuthenticated ?
        <>
            <li className="item has-submenu" 
             onMouseEnter={(e) => toggleMenu(e, 'navSubItem')}
             onMouseLeave={(e) => toggleMenu(e, 'navSubItem')}
            >
                <Link tabIndex="0" to="#">Profile</Link>
                <ul className="submenu">
                    <li className="subitem">
                        <Link to="/upload">Upload</Link>
                    </li>
                    <li className="subitem" onClick={() => dispatch(authActions.logout())}>
                        <Link to="/logout">Logout</Link>
                    </li>
                </ul>
            </li>
        </>
        :
        <>
            <li className="item button">
                <Link to="/sign-up">Sign Up</Link>
            </li>
            <li className="item button">
                <Link to="/login">Login</Link>
            </li>
        </>;
    return authNavValues;
}

const Header = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.user);

    return (
        <nav className="global-nav">
            <ul className="nav-menu">
                <li className="logo">
                    <Link to="/">Bluestone Comics</Link>
                </li>
                <li className="item">
                    <Link to="/about">About</Link>
                </li>
                <li className="item">
                    <Link to="/comic-list">Comic List</Link>
                </li>
                <li className="item">
                    <Link to="/contest">Contests</Link>
                </li>
                <li className="item">
                    <Link to="/articles">Articles</Link>
                </li>
                <li className="item">
                    <Link to="/news">News</Link>
                </li>
                <>
                {authNavItems(dispatch, isAuthenticated)}
                </>
                <li className="mobile-toggle" onClick={(e) => toggleMenu(e, 'mainNav')}>
                    <FontAwesomeIcon
                        icon={faBars}
                        size="2x"
                    />
                </li>
            </ul>
        </nav>
    );
}
export default Header;