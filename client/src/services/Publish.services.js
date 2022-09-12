import axios from "axios";
import { configObjects, configPageNumber } from "../utils/configObjects";

function createBook(formData, config = {}) {
  // send request to create a book which will contain the first issue
  const jwtToken = localStorage.getItem("jwtToken");

  config.headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  return axios.post("/api/v1/publish", formData, config);
}

function getBookAndIssueImagePrefix(
  bookId = "",
  issueNumber = "",
  config = {}
) {
  // send request to create a book which will contain the first issue
  const jwtToken = localStorage.getItem("jwtToken");

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

  return axios.get(
    `/api/v1/publish/get-book-and-issue-image-prefix${optionalBookIssue}`,
    config
  );
}

function getUsersBook(urlSlug, bookId) {
  return axios.get(
    `/api/v1/publish/${urlSlug}/book/${bookId}`,
    configObjects()
  );
}

function getUsersIssue(urlSlug, bookId, issueId) {
  return axios.get(
    `/api/v1/publish/${urlSlug}/book/${bookId}/issue/${issueId}`,
    configObjects()
  );
}

function getUsersIssues(urlSlug, bookId, pageNumber) {
  const config = configObjects();
  const appendedConfig = configPageNumber(config, pageNumber);

  return axios.get(
    `/api/v1/publish/${urlSlug}/book/${bookId}/issues`,
    appendedConfig()
  );
}

function updateBook(urlSlug, bookId, formData) {
  const config = configObjects();
  // const appendedConfig = configPageNumber(config, pageNumber);

  return axios.update(
    `/api/v1/publish/${urlSlug}/book/${bookId}`,
    formData,
    config
  );
}

export {
  createBook,
  getBookAndIssueImagePrefix,
  getUsersBook,
  getUsersIssue,
  getUsersIssues,
  updateBook,
};
