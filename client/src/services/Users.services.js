import axios from "axios";

export const UserServices = {
    getUser
}

function getUser(queryValue) {

    const target = {
        id: '',
        email: '',
        username: ''
    };

    const reqObj = Object.assign(target, queryValue);

    return axios.get(`/api/v1/users/get-user`, {
        params: {
           ...reqObj
        }
    });
}

// function getBooks() {

    // const reqObj = Object.assign(target, queryValue);

    // return axios.get(`/api/v1/publish/test-slug/book/`, {
    //     params: {
    //        ...reqObj
    //     }
    // });
// }

