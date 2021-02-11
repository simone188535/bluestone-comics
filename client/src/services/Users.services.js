import axios from "axios";

export const UserServices = {
    getUser
}
// may turn this into an object
function getUser(_id = '', email = '', username = '') {
    return axios.get(`/api/v1/users/get-user`, {
        _id,
        email,
        username
    });
}

