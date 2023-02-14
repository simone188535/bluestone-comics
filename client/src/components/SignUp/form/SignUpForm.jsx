import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authActions } from "../../../actions";

function SignUpForm() {
  const dispatch = useDispatch();
  const [enableMessage, setEnableMessage] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const hasError = useSelector((state) => state.error.hasError);
  const errorMessage = useSelector((state) => state.error.errorMessage);

  const onSubmit = async (values, { setSubmitting }) => {
    dispatch(
      authActions.signUp(
        values.firstName,
        values.lastName,
        values.username,
        values.email,
        values.password,
        values.passwordConfirm
      )
    );
    setEnableMessage(true);
    setSubmitting(false);
  };

  const isAuthMessage = () => {
    if (hasError) {
      return <span className="error-text-color">{errorMessage} </span>;
    }
    if (isAuthenticated) {
      return <span className="success-text-color"> Login successful!</span>;
    }
    return "";
  };

  useEffect(() => {
    // if isAuthenticated redirect
  }, [isAuthenticated]);

  return (
    <div className="sign-up-form-container">
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          passwordConfirm: "",
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required("First name required!"),
          lastName: Yup.string().required("Last name required!"),
          username: Yup.string().required("Username required!"),
          email: Yup.string()
            .email("Invalid email address!")
            .required("Email required!"),
          password: Yup.string().required("Password required!"),
          passwordConfirm: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match!")
            .required("Password confirm required!"),
        })}
        onSubmit={onSubmit}
      >
        <Form className="bsc-form sign-up-form">
          <div className="form-header-text">
            Please, <strong>Sign Up</strong> to continue
          </div>
          <div>
            <Field
              className="form-input form-item"
              name="firstName"
              type="text"
              placeholder="First Name"
              autoComplete="on"
            />
            <ErrorMessage
              className="error-message error-text-color"
              component="div"
              name="firstName"
            />

            <Field
              className="form-input form-item"
              name="lastName"
              type="text"
              placeholder="Last Name"
              autoComplete="on"
            />
            <ErrorMessage
              className="error-message error-text-color"
              component="div"
              name="lastName"
            />

            <Field
              className="form-input form-item"
              name="username"
              type="text"
              placeholder="Username"
              autoComplete="on"
            />
            <ErrorMessage
              className="error-message error-text-color"
              component="div"
              name="username"
            />

            <Field
              className="form-input form-item"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="on"
            />
            <ErrorMessage
              className="error-message error-text-color"
              component="div"
              name="email"
            />

            <Field
              className="form-input form-item"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="on"
            />
            <ErrorMessage
              className="error-message error-text-color"
              component="div"
              name="password"
            />

            <Field
              className="form-input form-item"
              name="passwordConfirm"
              type="password"
              placeholder="Password Confirm"
              autoComplete="on"
            />
            <ErrorMessage
              className="error-message error-text-color"
              component="div"
              name="passwordConfirm"
            />
          </div>
          <button type="submit" className="form-submit form-item">
            Submit
          </button>
        </Form>
      </Formik>
      <div className="final-message">{enableMessage && isAuthMessage()}</div>
    </div>
  );
}
export default SignUpForm;
