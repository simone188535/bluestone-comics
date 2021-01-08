import axios from "axios";

export const AuthenticationServices = {
    ReAuthUser,
    login,
    logout,
    signUp,
    forgotPassword
}

// This function helps ReAuth a user if the jwtToken is in the browser 
// https://stackoverflow.com/questions/47541032/handling-async-request-with-react-redux-and-axios
async function ReAuthUser(jwtToken) {
    try {
        const config = {
            headers: { Authorization: `Bearer ${jwtToken}` }
        };
        // send request to get-me (with bearer token) and return it
        const res = await axios.get('/api/v1/users/get-me', config);
        return res;
    }
    catch(err) {
        return err;
    }
}

function login(email, password) {
    // send request to login
    return axios.post('/api/v1/users/login', {
        email,
        password 
    });
}

function signUp(firstName, lastName, username, email, password, passwordConfirm) {
    // send request to sign up
    return axios.post('/api/v1/users/signup', {
        firstName,
        lastName,
        email,
        username,
        password,
        passwordConfirm 
    });
}

function logout() {
    localStorage.removeItem('jwtToken');
}

function forgotPassword(email) {
    // send request to forgotPassword
    return axios.post('/api/v1/users/forgot-password', {
        email 
    });
}