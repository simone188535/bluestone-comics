import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import SignUpForm from './form/SignUpForm';
import './sign-up.scss';

const SignUp = () => {

    return (
        <div className="sign-up-page container">
                <SignUpForm />
        </div>
    );
}
export default SignUp;