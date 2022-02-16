import axios from "axios";

function getUser(queryValue) {
  const target = {
    id: "",
    email: "",
    username: "",
  };

  const reqObj = Object.assign(target, queryValue);

  return axios.get(`/api/v1/users/get-user`, {
    params: {
      ...reqObj,
    },
  });
}

function updateMe(formData) {
  const jwtToken = localStorage.getItem("jwtToken");

  return axios.patch(`/api/v1/users/update-me`, formData, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
}
export { getUser, updateMe };
