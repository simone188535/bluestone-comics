import React from 'react';
import SignUpForm from './form/SignUpForm';
import './sign-up.scss';

const SignUp = () => {
    return (
        <div className="container-fluid sign-up-page">
            <div className="row">
                <div>Sign in to continue</div>
            </div>
            <div className="row justify-content-center h-100">
                <SignUpForm />
            </div>
        </div>
    );
}
export default SignUp;