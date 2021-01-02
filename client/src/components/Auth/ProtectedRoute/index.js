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

    console.log('isAuthenticated', isAuthenticated);
    return (
        // If the user is logged in, allow them to continue to the route, if not, redirect them to the login page.
        <>
            {
                <Route {...rest} render={props => <Component {...rest} {...props} />} />
                // (isAuthenticated) ?
                //     <Route {...rest} render={props => <Component {...rest} {...props} />} />
                //     :
                //     <Redirect to={
                //         {
                //             pathname: '/login',
                //         }
                //     } />
            }
        </>
    );

}

export default ProtectedRoute;