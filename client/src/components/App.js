import React from 'react';
import store from '../store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import About from './About';
import Articles from './Articles';
import ComicList from './ComicList';
import Contest from './Contest';
import News from './News';
import Upload from './Upload';


import { authActions } from '../actions';
import { AuthenticationServices } from '../services/Authentication.services';

// This reauths user if a jwtToken is preset in local storage. Skips login process for a 7 days
const jwtToken = localStorage.getItem('jwtToken');
if (jwtToken) {
    (async () => {
        store.dispatch(authActions.loginRequest());
        const currentUser = await AuthenticationServices.ReAuthUser(jwtToken);
        console.log('current', currentUser);
        if( currentUser.status === 200 ){
            return store.dispatch(authActions.loginSuccess(currentUser.data.data.user));
        }
    })();
}

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <div className="bsc">
                    <Header />
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
                    <Footer />
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;