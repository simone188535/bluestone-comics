import axios from 'axios';
import { FETCH_USER } from './types';

// This "nesting" is called currying. Go here for more: https://stackoverflow.com/questions/32782922/what-do-multiple-arrow-functions-mean-in-javascript
export const login = (email, password) => async ( dispatch ) => {
    const res = await axios.post('/api/v1/users/login', {
        email,
        password
    })

  dispatch({ type: FETCH_USER, payload: res.data });
};
// export const Signup = () => {
//     axios
//     };