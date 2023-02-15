import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  FETCHING,
  NOT_FETCHING,
  GET_ME,
} from "../actions/types";

const initialState = {
  isFetching: false,
  isAuthenticated: null,
  user: null,
  isReactivated: false,
};
// eslint-disable-next-line default-param-last
export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, isFetching: true, isAuthenticated: null };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        user: action.user,
        isReactivated: action.isReactivated,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        user: null,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        user: null,
        isReactivated: false,
      };
    case FETCHING:
      return {
        ...state,
        isFetching: true,
      };
    case NOT_FETCHING:
      return {
        ...state,
        isFetching: false,
      };
    case GET_ME:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
}
