// These methods should probably be made into a class;
export const configObjects = (config = {}) => {
  const jwtToken = localStorage.getItem("jwtToken");

  const axiosConfig = config;

  axiosConfig.headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  return axiosConfig;
};

export const configPageNumber = (config = {}, pageNumber = null) => {
  const axiosConfig = config;

  if (pageNumber) {
    axiosConfig.params = { page: pageNumber };
  }

  return axiosConfig;
};

export default { configObjects, configPageNumber };
