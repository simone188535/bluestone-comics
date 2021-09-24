import axios from "axios";

export const SearchServices = {
    searchUser,
    searchBooks,
    searchIssues
}

const searchAPIParams = {
    q: null,
    username: null,
    status: null,
    page: null,
    sort: null,
    limit: null
};

const reqObj = (queryValues) => {
    return Object.assign(searchAPIParams, queryValues);
}

function searchUser(queryUser) {
    const userToSearch = reqObj(queryUser);

    return axios.get(`/api/v1/search/users`,  { params: { ...userToSearch } });
}

function searchBooks(queryBooks) {
    const bookToSearch = reqObj(queryBooks);

    return axios.get(`/api/v1/search/books`,  { params: { ...bookToSearch } });
}

function searchIssues(queryIssues) {
    const issueToSearch = reqObj(queryIssues);

    return axios.get(`/api/v1/search/issues`,  { params: { ...issueToSearch } });
}

