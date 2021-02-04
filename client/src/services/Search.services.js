import axios from "axios";

export const SearchServices = {
    searchUser
}

function searchUser(queryUser) {
    return axios.get(`/api/v1/search/users?q=${queryUser}`);
}

