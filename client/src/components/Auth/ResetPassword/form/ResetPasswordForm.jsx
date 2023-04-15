import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authActions } from "../../../../actions";
import { AuthenticationServices } from "../../../../services";

function ResetPassword() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [enableMessage, setEnableMessage] = useState(false);
  const [resetIsPassword, setResetIsPassword] = useState(false);
  const { resetToken } = useParams();

  const authMessage = () => {
    const textColor = errorMessage ? "error-text-color" : "success-text-color";

    return <span className={textColor}> {statusMessage} </span>;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await AuthenticationServices.resetPassword(
        resetToken,
        values.newPassword,
        values.newPasswordConfirm
      );

      // unset error message if it is set.
      if (errorMessage) {
        setErrorMessage(false);
      }

      setStatusMessage("Your password has been reset.");
      setResetIsPassword(true);
    } catch (err) {
      setStatusMessage(err.response.data.message);
      setErrorMessage(true);
    }

    setEnableMessage(true);
    setSubmitting(false);
  };

  useEffect(() => {
    //  if password is reset. user should be logged out and redirected to login page
    if (resetIsPassword) {
      // if isAuthenticated redirect
      if (isAuthenticated) {
        dispatch(authActions.logout());
      }
      setTimeout(() => {
        // redirect to home page
        history.push("/login");
      }, 3000);
    }
  }, [resetIsPassword, history, dispatch, isAuthenticated]);

  return (
    <div className="reset-password-form-container auth-container">
      <Formik
        initialValues={{ newPassword: "", newPasswordConfirm: "" }}
        validationSchema={Yup.object({
          newPassword: Yup.string().required("Password required!"),
          newPasswordConfirm: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match!")
            .required("Password confirm required!"),
        })}
        onSubmit={onSubmit}
      >
        <Form className="bsc-form reset-password-form auth-form">
          <h1 className="form-header-text">
            Please, <strong>reset</strong> your password.
          </h1>
          <div>
            <Field
              className="form-input form-item auth-input"
              name="newPassword"
              type="password"
              placeholder="New Password"
              autoComplete="on"
            />
            <ErrorMessage
              className="error-message error-text-color"
              component="div"
              name="newPassword"
            />
            <Field
              className="form-input form-item auth-input"
              name="newPasswordConfirm"
              type="password"
              placeholder="Confirm New Password"
              autoComplete="on"
            />
            <ErrorMessage
              className="error-message error-text-color"
              component="div"
              name="newPasswordConfirm"
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
export default ResetPassword;
