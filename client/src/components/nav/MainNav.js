import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../actions";

const authNavItems = ( dispatch, isAuthenticated) => {

    const authNavValues = isAuthenticated ?
        <>
            <div onClick={() => dispatch(authActions.logout())}>
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
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    //console.log('!!!isAuthenticated: ',isAuthenticated);
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
            {authNavItems(dispatch, isAuthenticated)}
        </div>
    );
}
export default MainNav;