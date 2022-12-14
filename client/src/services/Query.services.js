import axios from "axios";

function querySearchType(searchType, queryParam = "") {
  return axios.get(`/api/v1/search/${searchType}${queryParam}`);
}

// eslint-disable-next-line import/prefer-default-export
export { querySearchType };
