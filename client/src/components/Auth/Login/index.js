import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './form/LoginForm';
import './login.scss';

const Login = () => {

    return (
        <div className="container login-page">
            <LoginForm />
            <Link className="text-blue forgot-password">Forgot your password?</Link>
        </div>
    );
}
export default Login;