import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  FETCHING,
  NOT_FETCHING,
  GET_ME,
} from "./types";
import { AuthenticationServices } from "../services";
import errorActions from "./errorActions";

const loginRequest = () => {
  return { type: LOGIN_REQUEST };
};

const loginSuccess = (user, isReactivated = false) => {
  return { type: LOGIN_SUCCESS, user, isReactivated };
};

const fetching = () => {
  return { type: FETCHING };
};

const notFetching = () => {
  return { type: NOT_FETCHING };
};

const loginFailure = () => {
  return { type: LOGIN_FAILURE };
};
// This "nesting" is called currying (it also counts as a higher order function). Go here for more: https://stackoverflow.com/questions/32782922/what-do-multiple-arrow-functions-mean-in-javascript
const login = (email, password) => async (dispatch) => {
  try {
    dispatch(errorActions.removeError());
    dispatch(loginRequest());

    const res = await AuthenticationServices.login(email, password);

    localStorage.setItem("jwtToken", res.data.token);

    dispatch(loginSuccess(res.data.data.user, res.data.isReactivated));
  } catch (err) {
    dispatch(loginFailure());
    dispatch(errorActions.setError(err.response.data.message));
  }
};
const signUp =
  (firstName, lastName, username, email, password, passwordConfirm) =>
  async (dispatch) => {
    try {
      dispatch(errorActions.removeError());
      dispatch(loginRequest());

      const res = await AuthenticationServices.signUp(
        firstName,
        lastName,
        username,
        email,
        password,
        passwordConfirm
      );

      localStorage.setItem("jwtToken", res.data.token);

      dispatch(loginSuccess(res.data.data.user));
    } catch (err) {
      dispatch(loginFailure());
      dispatch(errorActions.setError(err.response.data.message));
    }
  };

const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT_SUCCESS });
  AuthenticationServices.logout();
};

const refetchUser = () => async (dispatch) => {
  try {
    dispatch(fetching());
    const {
      data: { user },
    } = await AuthenticationServices.ReAuthUser();
    dispatch({ type: GET_ME, user });
    dispatch(notFetching());
  } catch (err) {
    dispatch(errorActions.setError(err.response.data.message));
  }
};

export default {
  loginRequest,
  loginSuccess,
  loginFailure,
  login,
  logout,
  signUp,
  refetchUser,
};
