import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Form as reactstrapForm, FormGroup, Label, Input, FormText } from 'reactstrap';
import * as Yup from 'yup';

const onSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
}

function LoginForm() {

    return (
        <reactstrapForm>
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
                    <FormGroup>
                        <label htmlFor="email">Email Address</label>
                        <Field name="email" type="email" />
                        <ErrorMessage name="email" />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="password">Password</label>
                        <Field name="password" type="password" />
                        <ErrorMessage name="password" />
                    </FormGroup>
                    <Button type="submit">Submit</Button>
                </Form>
            </Formik>
        </reactstrapForm>
    );
}
export default LoginForm;