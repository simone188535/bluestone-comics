import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authActions } from "../../../../actions";



function ForgotPasswordForm() {
    const history = useHistory();
    // const dispatch = useDispatch();
    const [enableMessage, setEnableMessage] = useState(false);
    // const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    // const hasError = useSelector(state => state.error.hasError);
    // const errorMessage = useSelector(state => state.error.errorMessage);

    // const authMessage = () => {
    //     if (isAuthenticated) {
    //         return <span className="success-text-color"> Login successful!</span>;
    //     } else if (hasError) {
    //         return <span className="error-text-color">{errorMessage} </span>;
    //     } else {
    //         return '';
    //     }
    // }

    const onSubmit = async (values, { setSubmitting }) => {
        // dispatch(authActions.login(values.email, values.password));
        setEnableMessage(true);
        setSubmitting(false);

    }


    // useEffect(() => {
    //     // if isAuthenticated redirect
    //     if (isAuthenticated) {
    //         setTimeout(() => {
    //             // redirect to home page
    //             history.push("/");
    //         }, 3000);
    //     }
    // }, [isAuthenticated, history]);

    return (
        <div className="forgot-password-form-container">
            <Formik
                initialValues={{ email: '' }}
                validationSchema={Yup.object({
                    email: Yup.string()
                        .email('Invalid email address')
                        .required('Email required!')
                })}
                onSubmit={onSubmit}
            >
                <Form className="bsc-form forgot-password-form">
                    <div className="form-header-text">Please, Provide your <strong>email</strong> so that your password can be reset.</div>
                    <div>
                        <Field className="form-input form-item" name="email" type="email" placeholder="Email" autoComplete="on" />
                        <ErrorMessage className="error-message error-text-color" component="div" name="email" />
                    </div>
                    <button type="submit" className="form-submit form-item">Submit</button>
                </Form>
            </Formik>
            {/* <div className="forgot-password-status-message">{enableMessage && authMessage()}</div> */}
        </div>
    );
}
export default ForgotPasswordForm;