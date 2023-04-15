import React from "react";
import ForgotPasswordForm from "./form/ForgotPasswordForm";
import MetaTags from "../../MetaTags";
import "../auth.scss";
import "./forgot-password.scss";

const ForgotPassword = () => {
  return (
    <>
      <MetaTags
        title="Bluestone Comics | Forgot Password"
        canonical="https://www.bluestonecomics.com/forgot-password"
        description="Forgot Your Password? Reset it using your email."
      />
      <div className="container auth-pages forgot-password-page min-vh100">
        <ForgotPasswordForm />
      </div>
    </>
  );
};
export default ForgotPassword;
