import React from 'react';
import { useSelector } from "react-redux";
// import { Nav, NavItem, NavLink } from 'reactstrap';

const authNavItems = (currentUser) => {

    const authNavValues = currentUser ?
        <>
            <div>
                <a href="/logout">Logout</a>
            </div>

        </>
        :
        <>
            <div>
                <a href="/sign-up">Sign Up</a>
            </div>
            <div>
                <a href="/login">Login</a>
            </div>
        </>;
    return authNavValues;
}
const MainNav = () => {
    const currentUser = useSelector(state => state.auth);

    return (
        <div className="justify-content-end" href="/home">
            <div>
                <a href="/">Home</a>
            </div>
            <div>
                <a href="/upload">Upload</a>
            </div>
            <div>
                <a href="/about">About</a>
            </div>
            <div>
                <a href="/comic-list">Comic List</a>
            </div>
            <div>
                <a href="/contest">Contests</a>
            </div>
            <div>
                <a href="/articles">Articles</a>
            </div>
            <div>
                <a href="/news">News</a>
            </div>
            {authNavItems(currentUser)}
        </div>
    );
}
export default MainNav;