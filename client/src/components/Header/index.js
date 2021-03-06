import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../actions";
import './header.scss';

/* 
    The purpose of this function is to add the active class to an element for styling purposes.
    If the active class is already added the it removes it (toggle effect). 
*/
const toggleMenu = (e, toggleFocus) => {
    let toggleItem;

    if (toggleFocus === 'mainNav') {
        toggleItem = document.querySelector('.nav-menu');
    } else if (toggleFocus === 'navSubItem') {
        toggleItem = e.currentTarget.querySelector('.submenu');
    } else if (toggleFocus === 'searchIcon') {
        toggleItem = document.querySelector('.search');
    }

    if (toggleItem.classList.contains('active')) {
        toggleItem.classList.remove('active');
    }
    else {
        toggleItem.classList.add('active');
    }
}


// These are nav items the render conditionally depending on whether the user is login or not
const AuthNavItems = () => {
    const dispatch = useDispatch();
    const [currentUsername, setCurrentUsername] = useState('');
    const { isAuthenticated, currentUser, isFetching } = useSelector(state => ({
        isAuthenticated: state.auth.isAuthenticated,
        currentUser: state.auth.user,
        isFetching: state.auth.isFetching
    }));
    let authNavValues;

    useEffect(() => {
        if (currentUser) {
            setCurrentUsername(currentUser.username);
        }
    }, [currentUser]);

    if (isFetching) {
        // If loading, show nothing
        authNavValues = <></>;
    } else if (isAuthenticated) {
        // If isAuthenticated show protected nav items
        authNavValues = (
            <>
                <li className="nav-menu-item has-submenu"
                    onMouseEnter={(e) => toggleMenu(e, 'navSubItem')}
                    onMouseLeave={(e) => toggleMenu(e, 'navSubItem')}
                >
                    <Link tabIndex="0" to="#">Profile</Link>
                    <ul className="submenu">
                        <li className="subitem">
                            <Link to={`/profile/${currentUsername}`}>Profile</Link>
                        </li>
                        <li className="subitem">
                            <Link to="/upload">Upload</Link>
                        </li>
                        <li className="subitem" onClick={() => dispatch(authActions.logout())}>
                            <Link to="/">Logout</Link>
                        </li>
                    </ul>
                </li>
            </>
        )
    }
    else {
        authNavValues = (<>
            <li className="nav-menu-item button">
                <Link to="/sign-up">Sign Up</Link>
            </li>
            <li className="nav-menu-item button">
                <Link to="/login">Login</Link>
            </li>
        </>);
    }
    return authNavValues;
}

const SearchIconToggle = ({searchToggle}) => {
    const toggleIcon = searchToggle ?
        <>
            <FontAwesomeIcon
                icon={faTimes}
                size="lg"
            />
        </> : <>
            <FontAwesomeIcon
                icon={faSearch}
                size="lg"
            />
        </>

    return toggleIcon;
}

const ShowSearchBar = ({searchToggle}) => {
    const searchBar = searchToggle ?
        <>
            <div className="global-nav-item searchbar-container">
                <form id="searchform" method="get" action="#">
                    <input type="search" name="nav-searchbar" className="nav-searchbar" placeholder="What are you look for?" autoComplete="off" />
                </form>
            </div>
        </> : null;

    return searchBar;
}


const Header = () => {
    const [searchToggle, setSearchToggle] = useState(false);

    const searchButtonClicked = (e) => {
        toggleMenu(e, 'searchIcon');
        setSearchToggle(!searchToggle);
    }

    return (
        <nav className="global-nav">
            <div className="global-nav-item logo">
                <Link to="/">Bluestone Comics</Link>
            </div>
            <ul className="global-nav-item nav-menu">
                <li className="nav-menu-item">
                    <Link to="/about">About</Link>
                </li>
                <li className="nav-menu-item">
                    <Link to="/comic-list">Comic List</Link>
                </li>
                <li className="nav-menu-item">
                    <Link to="/contest">Contests</Link>
                </li>
                <li className="nav-menu-item">
                    <Link to="/articles">Articles</Link>
                </li>
                <li className="nav-menu-item">
                    <Link to="/news">News</Link>
                </li>
                <>
                    <AuthNavItems />
                </>
            </ul>
            <div className="global-nav-item mobile-toggle" onClick={(e) => toggleMenu(e, 'mainNav')}>
                <FontAwesomeIcon
                    icon={faBars}
                    size="2x"
                />
            </div>
            <button className="global-nav-item search" onClick={(e) => searchButtonClicked(e)}>
                <SearchIconToggle searchToggle={searchToggle}/>
            </button>
            <ShowSearchBar searchToggle={searchToggle}/>
        </nav>
    );
}
export default Header;