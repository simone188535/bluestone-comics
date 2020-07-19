import React from 'react';
import store from '../store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainNav from './nav/MainNav';
import SignUp from './auth/SignUp';
import Login from './auth/Login';
import Footer from './nav/Footer';
import { authActions } from '../actions';
import { AuthenticationServices } from '../services/Authentication.services';

const jwtToken = localStorage.getItem('jwtToken');
if (jwtToken) {
    AuthenticationServices.ReAuthUser(jwtToken).then((currentUser) => {
        console.log('!!!!current User', currentUser);
        store.dispatch(authActions.fetchUser(currentUser));
    });


}

const Dashboard = () => <h2>Dashboard</h2>;
const SurveyNew = () => <h2>SurveyNew</h2>;
const Landing = () => {
    return (<h2>Landing</h2>);
}
const App = () => {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <MainNav />
                    <Switch>
                        <Route path="/survey" component={Dashboard} />
                        <Route path="/survey/new" component={SurveyNew} />
                        <Route path="/sign-up" component={SignUp} />
                        <Route path="/login" component={Login} />
                        <Route path="/" component={Landing} />
                    </Switch>
                    <Footer />
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;