import React from 'react';
import Nav from 'react-bootstrap/Nav';

const MainNav = () => {
    return (
        <Nav className="justify-content-end" activeKey="/home">
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/sign-up">Sign Up</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/login">Login</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}
export default MainNav;