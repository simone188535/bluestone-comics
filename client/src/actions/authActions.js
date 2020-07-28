import axios from 'axios';
import { FETCH_USER } from './types';

const fetchUser = (data) => {
    return { type: FETCH_USER, payload: data }
}
// This "nesting" is called currying (it also counts as a higher order function). Go here for more: https://stackoverflow.com/questions/32782922/what-do-multiple-arrow-functions-mean-in-javascript
const login = (email, password) => async (dispatch) => {
  try {
    const res = await axios.post('/api/v1/users/login', {
      email,
      password
    });

    localStorage.setItem('jwtToken', res.data.token);

    dispatch({ type: FETCH_USER, payload: res.data.data.user });
  } catch (err) {
    console.log('!!!!!!!!!!error', err);
    //send redux error
  }
};
 const Signup = () => {
    return false
    };

export const authActions = {
    fetchUser,
    login,
    Signup
}