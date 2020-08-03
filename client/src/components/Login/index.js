import React from 'react';
import LoginForm from './form/LoginForm';
import './login.scss';

const Login = () => {

    return (
        <div className="container-fluid login-page">
            <div className="row">
                <h2>Login</h2>
            </div>
            <div className="row">
                <LoginForm />
            </div>
        </div>
    );
}
export default Login;