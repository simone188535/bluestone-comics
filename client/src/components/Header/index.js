import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../actions";
import './header.scss';

const toggleMenu = () => {
    const menu = document.querySelector('.nav-menu');

    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
    else {
        menu.classList.add('active');
    }
}
const toggleSubMenuItem = (e) => {
    const subMenuItem = e.currentTarget.querySelector('.submenu');
    if (subMenuItem.classList.contains('submenu-active')) {
        subMenuItem.classList.remove('submenu-active');
    }
    else {
        subMenuItem.classList.add('submenu-active');
    }
}
const authNavItems = (dispatch, isAuthenticated) => {

    const authNavValues = isAuthenticated ?
        <>
            <li className="item has-submenu" onClick={(e) => toggleSubMenuItem(e)}>
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
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

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
                {authNavItems(dispatch, isAuthenticated)}
                <li className="toggle" onClick={() => toggleMenu()}>
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