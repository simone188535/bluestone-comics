import axios from "axios";

export const UserServices = {
    getUser
}

function getUser(_id = '', email = '', username = '') {
    return axios.get(`/api/v1/users/get-user`, {
        _id,
        email,
        username
    });
}

