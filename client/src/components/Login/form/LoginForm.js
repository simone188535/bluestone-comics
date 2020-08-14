import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authActions, errorActions } from "../../../actions";



function LoginForm() {
    const dispatch = useDispatch();
    const [enableMessage, setEnableMessage] = useState(false);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const hasError = useSelector(state => state.error.hasError);
    const errorMessage = useSelector(state => state.error.errorMessage);

    const authMessage = () => {
        if (hasError) {
            return <span className="error-message">{errorMessage} </span>;
        } else if (isAuthenticated) {
            return <span className="success-message"> Login successful!</span>;
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
        dispatch(errorActions.removeError());
    }, []);

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
                        <Field className="form-input form-item" name="email" type="email" placeholder="Email" autoComplete="on" />
                        <ErrorMessage className="error-message" component="div" name="email" />
                    </div>
                    <div className="form-group">
                        <Field className="form-input form-item" name="password" type="password" placeholder="Password" autoComplete="on" />
                        <ErrorMessage className="error-message" component="div" name="password" />
                    </div>
                    <button type="submit" className="form-submit form-item">Submit</button>
                </Form>
            </Formik>
            <div className="my-4 text-center">{enableMessage && authMessage()}</div>
        </div>
    );
}
export default LoginForm;