import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authActions } from "../../../../actions";



function LoginForm() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [enableMessage, setEnableMessage] = useState(false);
    const {isAuthenticated, isReactivated} = useSelector(state => ({
        isAuthenticated: state.auth.isAuthenticated,
        isReactivated: state.auth.isReactivated,
      }));
    const hasError = useSelector(state => state.error.hasError);
    const errorMessage = useSelector(state => state.error.errorMessage);

    const authMessage = () => {
        if (isAuthenticated) {
            const successMessage = isReactivated ? 'Your account has been reactivated!': 'Login successful!';
    
            return <span className="success-text-color"> {successMessage}</span>;
        } else if (hasError) {
            return <span className="error-text-color">{errorMessage} </span>;
        } else {
            return '';
        }
    }

    const onSubmit = async (values, { setSubmitting }) => {
        dispatch(authActions.login(values.email, values.password));
        setEnableMessage(true);
        setSubmitting(false);

    }


    useEffect(() => {
        // if isAuthenticated redirect
        if (isAuthenticated) {
            setTimeout(() => {
                // redirect to home page
                history.push("/");
            }, 3000);
        }
    }, [isAuthenticated, history]);

    return (
        <div className="login-page-form-container auth-container">
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
                <Form className="bsc-form login-page-form auth-form">
                    <div className="form-header-text">Please, <strong>Login</strong> to continue</div>
                    <div>
                        <Field className="form-input form-item auth-input" name="email" type="email" placeholder="Email" autoComplete="on" />
                        <ErrorMessage className="error-message error-text-color" component="div" name="email" />
                        <Field className="form-input form-item auth-input" name="password" type="password" placeholder="Password" autoComplete="on" />
                        <ErrorMessage className="error-message error-text-color" component="div" name="password" />
                    </div>
                    <button type="submit" className="form-submit form-item auth-submit">Submit</button>
                </Form>
            </Formik>
            <div className="status-message">{enableMessage && authMessage()}</div>
        </div>
    );
}
export default LoginForm;