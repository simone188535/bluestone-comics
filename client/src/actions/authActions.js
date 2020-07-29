import axios from 'axios';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS } from './types';
import { AuthenticationServices } from '../services/Authentication.services';

const loginRequest = () => {
  return { type: LOGIN_REQUEST }
}

const loginSuccess = (user) => {
  return { type: LOGIN_SUCCESS, user }
}

const loginFailure = ( error ) => {
  return { type: LOGIN_FAILURE, error }
}
// This "nesting" is called currying (it also counts as a higher order function). Go here for more: https://stackoverflow.com/questions/32782922/what-do-multiple-arrow-functions-mean-in-javascript
const login = (email, password) => async (dispatch) => {
  try {
    
    dispatch({ type: LOGIN_REQUEST });
    
    const res = await AuthenticationServices.login(email, password);

    localStorage.setItem('jwtToken', res.data.token);

    dispatch({ type: LOGIN_SUCCESS, user: res.data.data.user });
  } catch (err) {
      dispatch({ type: LOGIN_FAILURE, error: err.response.data });
  }
};
 const Signup = () => {
    return false
  };

export const authActions = {
    loginRequest,
    loginSuccess,
    loginFailure,
    login,
    Signup
}