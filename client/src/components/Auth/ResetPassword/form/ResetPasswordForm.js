import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthenticationServices } from '../../../../services';



function ResetPassword() {
    // const history = useHistory();
    const [statusMessage, setStatusMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);
    const [enableMessage, setEnableMessage] = useState(false);
    // const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    // const hasError = useSelector(state => state.error.hasError);
    // const errorMessage = useSelector(state => state.error.errorMessage);

    const authMessage = () => {

        let textColor = (errorMessage) ? 'error-text-color' : 'success-text-color';
       
        return <span className={textColor}> {statusMessage} </span>;
    }

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            await AuthenticationServices.forgotPassword(values.email);
            
            // unset error message if it is set.
            if (errorMessage) {
                setErrorMessage(false);
            }

            setStatusMessage('A reset token has been sent to your email.');

        } catch (err) {
            setStatusMessage(err.message);
            setErrorMessage(true);
        }
        
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
        <div className="reset-password-form-container">
            <Formik
                initialValues={{ newPassword: '', newPasswordConfirm: '' }}
                validationSchema={Yup.object({
                    newPassword: Yup.string()
                        .required('Password required!'),
                    newPasswordConfirm: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Passwords must match!')
                        .required('Password confirm required!')
                })}
                onSubmit={onSubmit}
            >
                <Form className="bsc-form reset-password-form">
                    <div className="form-header-text">Please, <strong>reset</strong> your password.</div>
                    <div>
                        <Field className="form-input form-item" name="newPassword" type="password" placeholder="New Password" autoComplete="on" />
                        <ErrorMessage className="error-message error-text-color" component="div" name="newPassword" />
                        <Field className="form-input form-item" name="newPasswordConfirm" type="password" placeholder="Confirm New Password" autoComplete="on" />
                        <ErrorMessage className="error-message error-text-color" component="div" name="newPasswordConfirm" />
                    </div>
                    <button type="submit" className="form-submit form-item">Submit</button>
                </Form>
            </Formik>
            <div className="reset-password-status-message">{enableMessage && authMessage()}</div>
        </div>
    );
}
export default ResetPassword;