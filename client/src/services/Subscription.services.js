import axios from "axios";

function checkSubscription(publisherId) {
  const jwtToken = localStorage.getItem("jwtToken");

  return axios.get(
    `/api/v1/subscribe/check-subscription/publisher/${publisherId}`,
    {
      headers: { Authorization: `Bearer ${jwtToken}` },
    }
  );
}

export { checkSubscription };
