import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import store from '../store';
import { authActions } from '../actions';
import { AuthenticationServices } from '../services';

import Header from './Header';
import Footer from './Footer';
import AllRoutes from './AllRoutes';

// This reauths user if a jwtToken is preset in local storage. Skips login process for a 7 days
const jwtToken = localStorage.getItem('jwtToken');
if (jwtToken) {
    (async () => {
        store.dispatch(authActions.loginRequest());
        const currentUser = await AuthenticationServices.ReAuthUser(jwtToken);
        
        if (currentUser.status === 200) {
            return store.dispatch(authActions.loginSuccess(currentUser.data.data.user));
        } 
        // else {
        //     // if there is a problem with the current token (like if token is Expired, untrusted...)
        //     return store.dispatch(authActions.logout());
        // }
    })();
}

const App = () => {
    return (
        <Router>
            <div className="bsc">
                <Header />
                <AllRoutes />
                <Footer />
            </div>
        </Router>
    );
}

export default App;