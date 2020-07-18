import React from 'react';
import { useSelector } from "react-redux";
import Nav from 'react-bootstrap/Nav';

const authNavItems = (currentUser) => {

    const authNavValues = currentUser ?
        <>
            <Nav.Item>
                <Nav.Link href="/logout">Logout</Nav.Link>
            </Nav.Item>

        </>
        :
        <>
            <Nav.Item>
                <Nav.Link href="/sign-up">Sign Up</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/login">Login</Nav.Link>
            </Nav.Item>
        </>;
    return authNavValues;
}
const MainNav = () => {
    const currentUser = useSelector(state => state.auth);
    return (
        <Nav className="justify-content-end" activeKey="/home">
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
            {authNavItems(currentUser)}
        </Nav>
    );
}
export default MainNav;