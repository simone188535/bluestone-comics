import axios from "axios";

function checkSubscription(profileUserId) {
  return axios.get("/api/v1/subscribe/check-subscription", {
    publisher: profileUserId,
  });
}

export { checkSubscription };
