import React from "react";
import ResetPasswordForm from "./form/ResetPasswordForm";
import "../auth.scss";
import "./reset-password.scss";

const ResetPassword = () => {
  return (
    <div className="container auth-pages reset-password-page min-vh100">
      <ResetPasswordForm />
    </div>
  );
};
export default ResetPassword;
