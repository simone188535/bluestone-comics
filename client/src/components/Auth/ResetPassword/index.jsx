import React from "react";
import ResetPasswordForm from "./form/ResetPasswordForm";
import MetaTags from "../../MetaTags";
import "../auth.scss";
import "./reset-password.scss";

const ResetPassword = () => {
  return (
    <>
      <MetaTags
        title="Bluestone Comics | Reset Password"
        description="Reset your password using the link from your email."
      >
        <meta name="robots" content="noindex, nofollow" />
      </MetaTags>
      <div className="container auth-pages reset-password-page min-vh100">
        <ResetPasswordForm />
      </div>
    </>
  );
};
export default ResetPassword;
