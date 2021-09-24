import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS } from '../actions/types';

const initialState = {
    isFetching: false,
    isAuthenticated: null,
    user: null,
    reactivated: false
  }
export default function(state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST: 
            return Object.assign({}, state, {
                isFetching: true,
                isAuthenticated: null
            });
        case LOGIN_SUCCESS: 
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: true,
                user: action.user,
                isReactivated: action.reactivated
            });
        case LOGIN_FAILURE: 
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                user: null
            })
        case LOGOUT_SUCCESS: 
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                user: null
            })
        default: 
            return state;
    }
}