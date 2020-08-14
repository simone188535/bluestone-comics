import React, { useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import About from './About';
import Articles from './Articles';
import ComicList from './ComicList';
import Contest from './Contest';
import News from './News';
import Upload from './Upload';

import store from '../store';

import { errorActions } from '../actions';

const AllRoutes = () => {
    const hasError = useSelector(state => state.error.hasError);
    let location = useLocation();
    // This watches for a route change in location
    useEffect(
        () => {
            // this works the same a componentDidUnmount
            return () => {
                // clears global error handler on route change if it exists
                if (hasError) {
                    store.dispatch(errorActions.removeError());
               }
            }
        }, [location]
    )
    return (
        <Switch>
            <Route path="/about" component={About} />
            <Route path="/articles" component={Articles} />
            <Route path="/contest" component={Contest} />
            <Route path="/comic-list" component={ComicList} />
            <Route path="/news" component={News} />
            <Route path="/upload" component={Upload} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/" component={Home} />
        </Switch>
    );
}

export default AllRoutes;