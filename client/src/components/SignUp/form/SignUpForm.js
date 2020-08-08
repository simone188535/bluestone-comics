import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authActions } from "../../../actions";



function SignUpForm() {
    const dispatch = useDispatch();

    const onSubmit = async (values, { setSubmitting }) => {
        dispatch(authActions.login(values.email, values.password));
        setSubmitting(false);
    }

    return (
        <div className="bsc-form sign-up-form">
            <Formik
                initialValues={{ firstName: '', lastName: '', username: '', email: '', password: '', passwordConfirm: '' }}
                validationSchema={Yup.object({
                    firstName: Yup.string()
                        .required('First Name Required'),
                    lastName: Yup.string()
                        .required('Last Name Required'),
                    username: Yup.string()
                        .required('Username Required'),
                    email: Yup.string()
                        .email('Invalid email address')
                        .required('Email Required'),
                    password: Yup.string()
                        .required('Password Required'),
                    passwordConfirm: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Passwords must match')
                        .required('Password Confirm Required')
                })}
                onSubmit={onSubmit}
            >
                <Form>
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
        </div>
    );
}
export default SignUpForm;