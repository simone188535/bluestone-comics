import axios from "axios";

export const PublishServices = {
    searchUser
}

function searchUser(queryUser) {
    return axios.get(`/api/v1/search/users?q=${queryUser}`);
}

