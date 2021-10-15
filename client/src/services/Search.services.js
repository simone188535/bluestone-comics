import axios from "axios";

const searchAPIParams = {
  q: null,
  username: null,
  status: null,
  page: null,
  sort: null,
  limit: null,
};

const reqObj = (queryValues) => {
  return Object.assign(searchAPIParams, queryValues);
};

function searchUser(queryUser) {
  const userToSearch = reqObj(queryUser);

  return axios
    .get(`/api/v1/search/users`, { params: { ...userToSearch } })
    .catch((error) => {
      console.log(error);
    });
}

function searchBooks(queryBooks) {
  const bookToSearch = reqObj(queryBooks);

  return axios
    .get(`/api/v1/search/books`, { params: { ...bookToSearch } })
    .catch((error) => {
      console.log(error);
    });
}

function searchIssues(queryIssues) {
  const issueToSearch = reqObj(queryIssues);

  return axios
    .get(`/api/v1/search/issues`, { params: { ...issueToSearch } })
    .catch((error) => {
      console.log(error);
    });
}

export { searchUser, searchBooks, searchIssues };
