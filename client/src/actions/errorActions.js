import { SET_ERROR, REMOVE_ERROR } from "./types";

const setError = (error) => {
  return { type: SET_ERROR, error };
};

const removeError = () => {
  return { type: REMOVE_ERROR };
};

export default {
  setError,
  removeError,
};
