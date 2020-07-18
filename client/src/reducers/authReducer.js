import { FETCH_USER } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_USER: 
        return action.payload || false;
        // Use log out to unset current user
        // case "LOG_OUT":
        //     return {
        //         ...state,
        //         user: {},
        //         loggedIn: false
        //     }
        default: 
            return state;
    }
}