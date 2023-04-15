import React from "react";
import SignUpForm from "./form/SignUpForm";
import MetaTags from "../../MetaTags";
import "../auth.scss";
import "./sign-up.scss";

const SignUp = () => {
  return (
    <>
      <MetaTags
        title="Bluestone Comics | Sign Up"
        canonical="https://www.bluestonecomics.com/sign-up"
        description="Sign up. Create, Bookmark and Read American Comics. Follow your favorite authors. Be notified when new issues are added."
      />
      <div className="sign-up-page auth-pages container min-vh100">
        <SignUpForm />
      </div>
    </>
  );
};
export default SignUp;
