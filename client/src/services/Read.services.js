import axios from "axios";
// import { configObjects, configPageNumber } from "../utils/configObjects";

function getBook(urlSlug, bookId) {
  return axios.get(`/api/v1/read/${urlSlug}/book/${bookId}`);
}

function getIssue(urlSlug, bookId, issueId) {
  return axios.get(`/api/v1/read/${urlSlug}/book/${bookId}/issue/${issueId}`);
}

function getIssues(urlSlug, bookId) {
  return axios.get(`/api/v1/read/${urlSlug}/book/${bookId}/issues`);
}

function getBookWorkCredits(urlSlug, bookId) {
  return axios.get(`/api/v1/read/${urlSlug}/book/${bookId}/work-credits`);
}

function getIssueWorkCredits(urlSlug, bookId, issueId) {
  return axios.get(
    `/api/v1/read/${urlSlug}/book/${bookId}/issue/${issueId}/work-credits`
  );
}

function getGenres(urlSlug, bookId) {
  return axios.get(`/api/v1/read/${urlSlug}/book/${bookId}/genres`);
}

export {
  getBook,
  getIssue,
  getIssues,
  getBookWorkCredits,
  getIssueWorkCredits,
  getGenres,
};
