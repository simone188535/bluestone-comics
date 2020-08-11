import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import SignUpForm from './form/SignUpForm';
import './sign-up.scss';

const SignUp = () => {

    return (
        <div className="container sign-up-page">
            <div className="row justify-content-center h-100">
                <SignUpForm />
            </div>
        </div>
    );
}
export default SignUp;