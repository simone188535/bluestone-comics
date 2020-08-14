import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authActions, errorActions } from "../../../actions";



function SignUpForm() {
    const dispatch = useDispatch();
    const [enableMessage, setEnableMessage] = useState(false);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const hasError = useSelector(state => state.error.hasError);
    const errorMessage = useSelector(state => state.error.errorMessage);

    const onSubmit = async (values, { setSubmitting }) => {
        dispatch(authActions.signUp(values.firstName, values.lastName, values.username, values.email, values.password ,values.passwordConfirm));
        setEnableMessage(true);
        setSubmitting(false);
    }

    const isAuthMessage = () => {
        if (hasError) {
            return <span className="error-message">{errorMessage} </span>;
        } else if (isAuthenticated) {
            return <span className="success-message"> Login successful!</span>;
        } else {
            return '';
        }
    }

    useEffect(() => {
        dispatch(errorActions.removeError());
    }, []);

    return (
        <div className="col-md-6 bsc-form sign-up-form">
            <Formik
                initialValues={{ firstName: '', lastName: '', username: '', email: '', password: '', passwordConfirm: '' }}
                validationSchema={Yup.object({
                    firstName: Yup.string()
                        .required('First name required!'),
                    lastName: Yup.string()
                        .required('Last name required!'),
                    username: Yup.string()
                        .required('User name required!'),
                    email: Yup.string()
                        .email('Invalid email address!')
                        .required('Email required!'),
                    password: Yup.string()
                        .required('Password required!'),
                    passwordConfirm: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Passwords must match!')
                        .required('Password confirm required!')
                })}
                onSubmit={onSubmit}
            >
                <Form>
                    <div className="form-header-text">Please, <strong>Sign in</strong> to continue</div>
                    <div className="form-group">
                        <Field className="form-input form-item" name="firstName" type="text" placeholder="First Name" autoComplete="on"/>
                        <ErrorMessage className="error-message" component="div" name="firstName" />
                    </div>
                    <div className="form-group">
                        <Field className="form-input form-item" name="lastName" type="text" placeholder="Last Name" autoComplete="on"/>
                        <ErrorMessage className="error-message" component="div" name="lastName" />
                    </div>
                    <div className="form-group">
                        <Field className="form-input form-item" name="username" type="text" placeholder="Username" autoComplete="on"/>
                        <ErrorMessage className="error-message" component="div" name="username" />
                    </div>
                    <div className="form-group">
                        <Field className="form-input form-item" name="email" type="email" placeholder="Email" autoComplete="on"/>
                        <ErrorMessage className="error-message" component="div" name="email" />
                    </div>
                    <div className="form-group">
                        <Field className="form-input form-item" name="password" type="password" placeholder="Password" autoComplete="on"/>
                        <ErrorMessage className="error-message" component="div" name="password" />
                    </div>
                    <div className="form-group">
                        <Field className="form-input form-item" name="passwordConfirm" type="password" placeholder="Password Confirm" autoComplete="on"/>
                        <ErrorMessage className="error-message" component="div" name="passwordConfirm" />
                    </div>
                    <button type="submit" className="form-submit form-item">Submit</button>
                </Form>
            </Formik>
            <div className="my-4 text-center">{enableMessage && isAuthMessage()}</div>
        </div>
    );
}
export default SignUpForm;