import axios from "axios";

function add(publisherId) {
  const jwtToken = localStorage.getItem("jwtToken");

  return axios.post(`api/v1/subscribe/add/publisher/${publisherId}`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
}

function remove(publisherId) {
  const jwtToken = localStorage.getItem("jwtToken");

  return axios.delete(`/api/v1/subscribe/remove/publisher/${publisherId}`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
}

function checkSubscription(publisherId) {
  const jwtToken = localStorage.getItem("jwtToken");

  return axios.get(
    `/api/v1/subscribe/check-subscription/publisher/${publisherId}`,
    {
      headers: { Authorization: `Bearer ${jwtToken}` },
    }
  );
}

export { add, remove, checkSubscription };
