import axios from "axios";

const configObj = () => {
  const jwtToken = localStorage.getItem("jwtToken");
  const config = {};

  config.headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  return config;
};

function add(publisherId) {
  return axios.post(
    `/api/v1/subscribe/add/publisher/${publisherId}`,
    {},
    configObj()
  );
}

function remove(publisherId) {
  return axios.delete(
    `/api/v1/subscribe/remove/publisher/${publisherId}`,
    configObj()
  );
}

function checkSubscription(publisherId) {
  return axios.get(
    `/api/v1/subscribe/check-subscription/publisher/${publisherId}`,
    configObj()
  );
}

function getAllSubscribedTo(subscriberId, pageNumber = null) {
  const config = configObj();

  if (pageNumber) {
    config.params = { page: pageNumber };
  }
  return axios.get(
    `/api/v1/subscribe/get-all-subscribed-to/subscriber/${subscriberId}`,
    config
  );
}

function getAllSubscribers(publisherId, pageNumber = null) {
  const config = configObj();

  if (pageNumber) {
    config.params = { page: pageNumber };
  }

  return axios.get(
    `/api/v1/subscribe/get-all-subscribers/publisher/${publisherId}`,
    config
  );
}

function getTotalSubscribers(publisherId) {
  return axios.get(
    `/api/v1/subscribe/total-subscribers/publisher/${publisherId}`
  );
}

function getTotalSubscribedTo(subscriberId) {
  return axios.get(
    `/api/v1/subscribe/total-subscribed-to/subscriber/${subscriberId}`
  );
}

export {
  add,
  remove,
  checkSubscription,
  getAllSubscribers,
  getAllSubscribedTo,
  getTotalSubscribers,
  getTotalSubscribedTo,
};
