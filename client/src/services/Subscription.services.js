import axios from "axios";

const jwtToken = localStorage.getItem("jwtToken");
const config = {};

config.headers = {
  Authorization: `Bearer ${jwtToken}`,
};

function add(publisherId) {
  return axios.post(
    `/api/v1/subscribe/add/publisher/${publisherId}`,
    {},
    config
  );
}

function remove(publisherId) {
  return axios.delete(
    `/api/v1/subscribe/remove/publisher/${publisherId}`,
    config
  );
}

function checkSubscription(publisherId) {
  return axios.get(
    `/api/v1/subscribe/check-subscription/publisher/${publisherId}`,
    config
  );
}

function getAllSubscriberedTo(subscriberId, pageNumber = null) {
  if (pageNumber) {
    // params: { page: pageNumber }
    config.params = { page: pageNumber };
  }
  return axios.get(
    `/api/v1/subscribe/get-all-subscribed-to/subscriber/${subscriberId}`,
    config
  );
}

function getAllSubscribers(publisherId, pageNumber = null) {
  if (pageNumber) {
    // params: { page: pageNumber }
    config.params = { page: pageNumber };
  }
  return axios.get(
    `/api/v1/subscribe/get-all-subscribers/publisher/${publisherId}`,
    config
  );
}

export {
  add,
  remove,
  checkSubscription,
  getAllSubscribers,
  getAllSubscriberedTo,
};
