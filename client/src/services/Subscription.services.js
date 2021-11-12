import axios from "axios";

function checkSubscription(profileUserId) {
  const jwtToken = localStorage.getItem("jwtToken");

  return axios.get(
    `/api/v1/subscribe/check-subscription/publisher/${profileUserId}`,
    {
      headers: { Authorization: `Bearer ${jwtToken}` },
    }
  );
}

export { checkSubscription };
