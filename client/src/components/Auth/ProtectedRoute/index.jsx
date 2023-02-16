import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

/* 
    For more info on how this works: 
    https://dev.to/mychal/protected-routes-with-react-function-components-dh
    https://www.youtube.com/watch?v=Y0-qdp-XBJg
*/
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isFetching } = useSelector((state) => state.auth);

  const checkIfUserIsAllowedToAccessRoute = () => {
    if (!isAuthenticated && !isFetching) {
      // if isAuthenticated is false, redirect to login route
      return (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      );
    }
    // if isAuthenticated equals true proceed to provided route
    return (
      <Route {...rest} render={(props) => <Component {...rest} {...props} />} />
    );
  };
  return (
    // If the user is logged in, allow them to continue to the route, if not, redirect them to the login page.
    <>{checkIfUserIsAllowedToAccessRoute()}</>
  );
};

export default ProtectedRoute;
