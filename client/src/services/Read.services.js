import axios from "axios";
// import { configObjects, configPageNumber } from "../utils/configObjects";

function getBook(urlSlug, bookId) {
  return axios.get(`/api/v1/read/${urlSlug}/book/${bookId}`);
}

function getIssue(urlSlug, bookId, issueId) {
  return axios.get(`/api/v1/read/${urlSlug}/book/${bookId}/issue/${issueId}`);
}

function getBookWorkCredits(urlSlug, bookId) {
  return axios.get(`/api/v1/read/${urlSlug}/book/${bookId}/work-credits`);
}

function getIssueWorkCredits(urlSlug, bookId, issueId) {
  return axios.get(
    `/api/v1/read/${urlSlug}/book/${bookId}/Issue/${issueId}/work-credits`
  );
}

function getGenres(bookId) {
  return axios.get(`/api/v1/read/test-slug/${bookId}/87/genres`);
}

export {
  getBook,
  getIssue,
  getBookWorkCredits,
  getIssueWorkCredits,
  getGenres,
};
