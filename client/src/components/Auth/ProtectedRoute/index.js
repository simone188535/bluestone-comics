import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest}) => {
    
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    
    return (
        <Component />
    );

}

export default ProtectedRoute;