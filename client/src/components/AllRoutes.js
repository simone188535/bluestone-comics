import React, { useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

import Home from './Home';
import SignUp from './Auth/SignUp';
import Login from './Auth/Login';
import About from './About';
import Articles from './Articles';
import ComicList from './ComicList';
import Contest from './Contest';
import News from './News';
import Upload from './Upload';
import ProtectedRoute from './Auth/ProtectedRoute';

import store from '../store';

import { errorActions } from '../actions/index';

const AllRoutes = () => {
    const hasError = useSelector(state => state.error.hasError);
    let location = useLocation();
    // This watches for a route change in location
    useEffect(
        () => {
            // This clears the global redux error state if the route changes
            if (hasError) {
                store.dispatch(errorActions.removeError());
            }
        }, [location, hasError]
    )
    return (
        <Switch>
            <Route path="/about" component={About} />
            <Route path="/articles" component={Articles} />
            <Route path="/contest" component={Contest} />
            <Route path="/comic-list" component={ComicList} />
            <Route path="/news" component={News} />
            <ProtectedRoute path="/upload" component={Upload}/>
            <Route path="/sign-up" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/" component={Home} />
        </Switch>
    );
}

export default AllRoutes;