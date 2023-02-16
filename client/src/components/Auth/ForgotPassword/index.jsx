import React from "react";
import ForgotPasswordForm from "./form/ForgotPasswordForm";
import "../auth.scss";
import "./forgot-password.scss";

const ForgotPassword = () => {
  return (
    <div className="container auth-pages forgot-password-page min-vh100">
      <ForgotPasswordForm />
    </div>
  );
};
export default ForgotPassword;
