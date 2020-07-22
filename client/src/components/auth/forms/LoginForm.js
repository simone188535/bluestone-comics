import React from 'react';
import { useFormik } from 'formik';


const initialValues = {
    email: '',
    password: ''
}
const onSubmit = values => {
    console.log('Form data', values)
}

const validate = values => {
    let errors = {};
    if (!values.name) {
        errors.name = 'Required';
    }
    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email format';
    }

    return errors;
}
function LoginForm (props) {
    const formik = useFormik({
        initialValues,
        onSubmit,
        validate
    });

    console.log('Form values', formik.errors);
    return(
        <div>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" onChange={formik.handleChange} value={formik.values.email}/>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" onChange={formik.handleChange} value={formik.values.password}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
export default LoginForm;