import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthenticationServices } from '../../../services/Authentication.services';

const onSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    const res = await AuthenticationServices.login(values.email, values.password);
    console.log('!!!!!!!!!!!',res);
    // dispatch action
    setSubmitting(false);
}

function LoginForm() {

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
export default LoginForm;