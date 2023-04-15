import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./form/LoginForm";
import MetaTags from "../../MetaTags";
import "../auth.scss";
import "./login.scss";

const Login = () => {
  return (
    <>
      <MetaTags
        title="Bluestone Comics | Login"
        canonical="https://www.bluestonecomics.com/login"
        description="Login. Access your existing account. Create, Bookmark and Read American Comics."
      />
      <div className="container auth-pages login-page min-vh100">
        <LoginForm />
        <Link className="text-blue forgot-password" to="/forgot-password">
          Forgot your password?
        </Link>
      </div>
    </>
  );
};
export default Login;
