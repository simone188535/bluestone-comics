import axios from "axios";

export const AuthenticationServices = {
    ReAuthUser
}

// This function helps ReAuth a user if the jwtToken is in the browser 
function ReAuthUser() {
    try {
        // send request to get-me (with bearer token) and return it
    }
    catch(err) {
        console.log(err);
    }
}