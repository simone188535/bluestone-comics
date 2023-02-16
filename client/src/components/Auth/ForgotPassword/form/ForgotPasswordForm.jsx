import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthenticationServices } from "../../../../services";

function ForgotPasswordForm() {
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [enableMessage, setEnableMessage] = useState(false);

  const authMessage = () => {
    const textColor = errorMessage ? "error-text-color" : "success-text-color";

    return <span className={textColor}> {statusMessage} </span>;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await AuthenticationServices.forgotPassword(values.email);

      // unset error message if it is set.
      if (errorMessage) {
        setErrorMessage(false);
      }

      setStatusMessage("A reset token has been sent to your email.");
    } catch (err) {
      setStatusMessage(err.response.data.message);
      setErrorMessage(true);
    }

    setEnableMessage(true);
    setSubmitting(false);
  };

  return (
    <div className="forgot-password-form-container auth-container">
      <Formik
        initialValues={{ email: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Email required!"),
        })}
        onSubmit={onSubmit}
      >
        <Form className="bsc-form forgot-password-form auth-form">
          <div className="form-header-text">
            Please, Provide your <strong>email</strong> so that your password
            can be reset.
          </div>
          <div>
            <Field
              className="form-input form-item auth-input"
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
          </div>
          <button type="submit" className="form-submit form-item auth-submit">
            Submit
          </button>
        </Form>
      </Formik>
      <div className="status-message">{enableMessage && authMessage()}</div>
    </div>
  );
}
export default ForgotPasswordForm;
