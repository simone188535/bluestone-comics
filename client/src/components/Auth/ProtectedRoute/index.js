import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { Route, Redirect } from 'react-router-dom';

/* 
For more info on how this works: 
https://dev.to/mychal/protected-routes-with-react-function-components-dh
https://www.youtube.com/watch?v=Y0-qdp-XBJg
*/
const ProtectedRoute = ({ component: Component, ...rest }) => {

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const checkIfUserIsAllowedToAccessRoute = () => {
        switch (isAuthenticated) {
            case null:
                // if isAuthenticated is null do nothing
                return null
            case false:
                // if isAuthenticated is false, redirect to login route
                return (
                    <Redirect to={
                        {
                            pathname: '/login',
                        }
                    } />
                )
            default:
                // if isAuthenticated equals true proceed to provided route
                return <Route {...rest} render={props => <Component {...rest} {...props} />} />;
        }
    }
    return (
        // If the user is logged in, allow them to continue to the route, if not, redirect them to the login page.
        <>
            {
               checkIfUserIsAllowedToAccessRoute()
            }
        </>
    );

}

export default ProtectedRoute;