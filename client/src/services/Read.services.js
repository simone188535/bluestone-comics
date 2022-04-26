import axios from "axios";
// import { configObjects, configPageNumber } from "../utils/configObjects";

const configObj = () => {
  const jwtToken = localStorage.getItem("jwtToken");
  const config = {};

  config.headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  return config;
};

function getBook(urlSlug, bookId) {
  return axios.get(`/api/v1/read/${urlSlug}/book/${bookId}`, configObj());
}

function getIssue(urlSlug, bookId, issueId) {
  return axios.get(
    `/api/v1/read/${urlSlug}/book/${bookId}/issue/${issueId}`,
    configObj()
  );
}

// function getIssues(urlSlug, bookId, pageNumber) {
//   const config = configObjects();
//   const appendedConfig = configPageNumber(config, pageNumber);

//   return axios.get(
//     `/api/v1/read/${urlSlug}/book/${bookId}/issues`,
//     appendedConfig()
//   );
// }

export { getBook, getIssue };
