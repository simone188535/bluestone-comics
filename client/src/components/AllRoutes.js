import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import About from './About';
import Articles from './Articles';
import ComicList from './ComicList';
import Contest from './Contest';
import News from './News';
import Upload from './Upload';

const AllRoutes = () => {

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