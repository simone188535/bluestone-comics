import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions";

const Login = () => {
    const dispatch = useDispatch();
    return(<h2 onClick={() => dispatch(login())}>Login</h2>);
}
export default Login;