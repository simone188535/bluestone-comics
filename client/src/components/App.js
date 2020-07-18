import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainNav from './nav/MainNav';
import SignUp from './auth/SignUp';
import Login from './auth/Login';
import Footer from './nav/Footer';
import { AuthenticationServices } from '../services/Authentication.services';

if (localStorage.getItem('jwtToken')) {
    const currentUser = AuthenticationServices.ReAuthUser();
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