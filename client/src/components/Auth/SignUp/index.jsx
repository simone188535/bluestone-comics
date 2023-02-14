import React from "react";
import SignUpForm from "./form/SignUpForm";
import "../auth.scss";
import "./sign-up.scss";

const SignUp = () => {
  return (
    <div className="sign-up-page auth-pages container min-vh100">
      <SignUpForm />
    </div>
  );
};
export default SignUp;
