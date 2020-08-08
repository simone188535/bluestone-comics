import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authActions } from "../../../actions";



function LoginForm() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authenticationErrorMessage = useSelector(state => state.auth.errorMessage);

    const onSubmit = async (values, { setSubmitting }) => {
        dispatch(authActions.login(values.email, values.password));
        setSubmitting(false);
        // if isAuthenticated redirect
    }

    const isAuthMessage = () => {
        if (authenticationErrorMessage) {
            return <span className="error-message">{authenticationErrorMessage} </span>;
        } else if (isAuthenticated) {
            return <span className="success-message"> Login successful!</span>;
        } else {
            return '';
        }
    }

    return (
        <div className="col-md-6 bsc-form login-form">
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                    email: Yup.string()
                        .email('Invalid email address')
                        .required('Email required!'),
                    password: Yup.string()
                        .required('Password required!'),
                })}
                onSubmit={onSubmit}
            >
                <Form>
                    <div className="form-group">
                    <div className="form-header-text">Please, <strong>Login</strong> to continue</div>
                        <Field className="form-input form-item" name="email" type="email" placeholder="Email" autoComplete="on"/>
                        <ErrorMessage className="error-message" component="div" name="email" />
                    </div>
                    <div className="form-group">
                        <Field className="form-input form-item" name="password" type="password" placeholder="Password" autoComplete="on"/>
                        <ErrorMessage className="error-message" component="div" name="password" />
                    </div>
                    <button type="submit" className="form-submit form-item">Submit</button>
                </Form>
            </Formik>
            <div className="my-4 text-center">{isAuthMessage()}</div>
        </div>
    );
}
export default LoginForm;