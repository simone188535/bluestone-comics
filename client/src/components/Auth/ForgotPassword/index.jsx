import React from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from './form/ForgotPasswordForm';
import './../auth.scss';
import './forgot-password.scss';

const ForgotPassword = () => {

    return (
        <div className="container auth-pages forgot-password-page">
            <ForgotPasswordForm />
        </div>
    );
}
export default ForgotPassword;