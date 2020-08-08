import React from 'react';
import LoginForm from './form/LoginForm';
import './login.scss';

const Login = () => {

    return (
        <div className="container login-page">
            <div className="row justify-content-center h-100">
                <LoginForm />
            </div>
        </div>
    );
}
export default Login;