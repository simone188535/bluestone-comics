import React from 'react';
import { useSelector } from "react-redux";
import { Nav, NavItem, NavLink } from 'reactstrap';

const authNavItems = (currentUser) => {

    const authNavValues = currentUser ?
        <>
            <NavItem>
                <NavLink href="/logout">Logout</NavLink>
            </NavItem>

        </>
        :
        <>
            <NavItem>
                <NavLink href="/sign-up">Sign Up</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/login">Login</NavLink>
            </NavItem>
        </>;
    return authNavValues;
}
const MainNav = () => {
    const currentUser = useSelector(state => state.auth);
    
    return (
        <Nav className="justify-content-end" href="/home">
            <NavItem>
                <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/upload">Upload</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/about">About</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/comic-list">Comic List</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/contest">Contests</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/articles">Articles</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/news">News</NavLink>
            </NavItem>
            {authNavItems(currentUser)}
        </Nav>
    );
}
export default MainNav;