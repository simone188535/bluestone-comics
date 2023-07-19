import React from "react";
import { Route } from "react-router-dom";

/* 
    A special wrapper for <Route> that knows how to
    handle "sub"-routes by passing them in a `routes`
    prop to the component it renders.

    This is perfect for implementing over nested routes: 
    ie route: /taco, sub-route: /taco/cart

    example: https://v5.reactrouter.com/web/example/route-config line:63
*/

function RouteWithSubRoutes({ path, component: Component, routes, ...rest }) {
  return (
    <Route
      path={path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <Component {...props} routes={routes} />
      )}
      {...rest}
    />
  );
}

export default RouteWithSubRoutes;
