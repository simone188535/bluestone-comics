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

function getBookAndIssueImagePrefix(bookId = "", issueNumber = "") {
  // send request to create a book which will contain the first issue
  const config = configObjects();

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

function updateBook(urlSlug, bookId, formData, config = {}) {
  const configObj = configObjects();
  const newConfigObj = Object.assign(config, configObj);
  // const appendedConfig = configPageNumber(config, pageNumber);

  return axios.patch(
    `/api/v1/publish/${urlSlug}/book/${bookId}`,
    formData,
    newConfigObj
  );
}

function createIssue(urlSlug, bookId, formData, config = {}) {
  const configObj = configObjects();
  const newConfigObj = Object.assign(config, configObj);

  return axios.post(
    `/api/v1/publish/${urlSlug}/book/${bookId}`,
    formData,
    newConfigObj
  );
}

function deleteBook(urlSlug, bookId) {
  const config = configObjects();

  return axios.delete(`/api/v1/publish/${urlSlug}/book/${bookId}`, config);
}

function updateBookCoverPhoto(urlSlug, bookId, formData, config = {}) {
  // update previously existing book cover photo
  const configObj = configObjects();
  const newConfigObj = Object.assign(config, configObj);

  return axios.patch(
    `/api/v1/publish/${urlSlug}/book/${bookId}/book-cover-photo`,
    formData,
    newConfigObj
  );
}
export {
  createBook,
  getBookAndIssueImagePrefix,
  getUsersBook,
  getUsersIssue,
  getUsersIssues,
  updateBook,
  createIssue,
  deleteBook,
  updateBookCoverPhoto,
};
