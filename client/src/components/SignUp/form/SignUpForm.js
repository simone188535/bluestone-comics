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
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                    email: Yup.string()
                        .email('Invalid email address')
                        .required('Required'),
                    password: Yup.string()
                        .required('Required'),
                })}
                onSubmit={onSubmit}
            >
                <Form>
                    <label htmlFor="email">Email Address</label>
                    <Field name="email" type="email" />
                    <ErrorMessage name="email" />
                    <label htmlFor="password">Password</label>
                    <Field name="password" type="password" />
                    <ErrorMessage name="password" />
                    <button type="submit">Submit</button>
                </Form>
            </Formik>
    );
}
export default SignUpForm;