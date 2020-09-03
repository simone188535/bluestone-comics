import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../actions";
import './header.scss';

const authNavItems = ( dispatch, isAuthenticated) => {
    
    const authNavValues = isAuthenticated ?
        <>
            <li className="nav-item" onClick={() => dispatch(authActions.logout())}>
                <Link className="nav-link" to="/logout">Logout</Link>
            </li>

        </>
        :
        <>
            <li className="nav-item">
                <Link className="nav-link" to="/sign-up">Sign Up</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
            </li>
        </>;
    return authNavValues;
}

const Header = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
   
    return (
        <nav className="navbar navbar-expand-sm  bsc-header">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/upload">Upload</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/comic-list">Comic List</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/contest">Contests</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/articles">Articles</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/news">News</Link>
                </li>
                {authNavItems(dispatch, isAuthenticated)}
            </ul>
        </nav>
    );
}
export default Header;