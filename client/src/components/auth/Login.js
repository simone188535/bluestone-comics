import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import LoginForm from './forms/LoginForm';
import { login } from "../../actions";

const Login = () => {
    const dispatch = useDispatch();
    return(
    <div>
        <h2 onClick={() => dispatch(login('simone.anthony@yahoo.com', 'testing1234'))}>Login</h2>
        <LoginForm />
    </div>
    );
}
export default Login;