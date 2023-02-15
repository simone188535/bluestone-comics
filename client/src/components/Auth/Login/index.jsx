import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./form/LoginForm";
import "../auth.scss";
import "./login.scss";

const Login = () => {
  return (
    <div className="container auth-pages login-page min-vh100">
      <LoginForm />
      <Link className="text-blue forgot-password" to="/forgot-password">
        Forgot your password?
      </Link>
    </div>
  );
};
export default Login;
