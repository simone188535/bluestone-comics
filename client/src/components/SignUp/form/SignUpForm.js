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
        <div>
            <Formik
                initialValues={{ firstName: '', lastName: '', username: '', email: '', password: '', passwordConfirm: '' }}
                validationSchema={Yup.object({
                    firstName: Yup.string()
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                    lastName: Yup.string()
                        .max(20, 'Must be 20 characters or less')
                        .required('Required'),
                    username: Yup.string()
                        .max(20, 'Must be 20 characters or less')
                        .required('Required'),
                    email: Yup.string()
                        .email('Invalid email address')
                        .required('Required'),
                    password: Yup.string()
                        .required('Required'),
                    passwordConfirm: Yup.string()
                        .required('Required'),
                })}
                onSubmit={onSubmit}
            >
                <Form>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name: </label>
                        <Field name="firstName" type="text" />
                        <ErrorMessage name="firstName" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name: </label>
                        <Field name="lastName" type="text" />
                        <ErrorMessage name="lastName" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username: </label>
                        <Field name="username" type="text" />
                        <ErrorMessage name="username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address: </label>
                        <Field name="email" type="email" />
                        <ErrorMessage name="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Field name="password" type="password" />
                        <ErrorMessage name="password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordConfirm">Password Confirm</label>
                        <Field name="passwordConfirm" type="password" />
                        <ErrorMessage name="passwordConfirm" />
                    </div>
                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    );
}
export default SignUpForm;