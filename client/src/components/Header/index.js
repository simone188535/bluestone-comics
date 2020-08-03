import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../actions";
import './header.scss';

const authNavItems = ( dispatch, isAuthenticated) => {
    
    const authNavValues = isAuthenticated ?
        <>
            <li className="nav-item" onClick={() => dispatch(authActions.logout())}>
                <a className="nav-link" href="/logout">Logout</a>
            </li>

        </>
        :
        <>
            <li className="nav-item">
                <a className="nav-link" href="/sign-up">Sign Up</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="/login">Login</a>
            </li>
        </>;
    return authNavValues;
}

const Header = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
   
    return (
        <nav className="navbar navbar-expand-sm bg-light navbar-light bsc-header">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="/">Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/upload">Upload</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/about">About</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/comic-list">Comic List</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/contest">Contests</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/articles">Articles</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/news">News</a>
                </li>
                {authNavItems(dispatch, isAuthenticated)}
            </ul>
        </nav>
    );
}
export default Header;