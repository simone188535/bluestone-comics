import React from 'react';
import SignUpForm from './form/SignUpForm';
import './sign-up.scss';

const SignUp = () => {
    return (
        <div className="container-fluid sign-up-page">
            <div className="row">
                <h2>SignUp</h2>
            </div>
            <div className="row">
                <SignUpForm />
            </div>
        </div>
    );
}
export default SignUp;