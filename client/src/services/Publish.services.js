import axios from "axios";

function createBook(formData, config = {}) {
  // send request to create a book which will contain the first issue
  const jwtToken = localStorage.getItem("jwtToken");

  // eslint-disable-next-line no-param-reassign
  config.headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  return axios.post("/api/v1/publish", formData, config).catch((error) => {
    console.log(error);
  });
}

function getBookAndIssueImagePrefix(
  bookId = "",
  issueNumber = "",
  config = {}
) {
  // send request to create a book which will contain the first issue
  const jwtToken = localStorage.getItem("jwtToken");

  // eslint-disable-next-line no-param-reassign
  config.headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  let optionalBookIssue = ``;

  if (bookId) {
    optionalBookIssue += `/${bookId}`;
    if (issueNumber) {
      optionalBookIssue += `/${issueNumber}`;
    }
  }

  return axios
    .get(
      `/api/v1/publish/get-book-and-issue-image-prefix${optionalBookIssue}`,
      config
    )
    .catch((error) => {
      console.log(error);
    });
}

export { createBook, getBookAndIssueImagePrefix };
