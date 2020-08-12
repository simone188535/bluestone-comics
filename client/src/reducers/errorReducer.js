
import { SET_ERROR, REMOVE_ERROR } from '../actions/types';

const initialState = {
    hasError: false,
    errorMessage: null
  }
export default function(state = initialState, action) {
    switch (action.type) {
        case SET_ERROR: 
            return Object.assign({}, state, {
                hasError: true,
                errorMessage: action.error
            });
        case REMOVE_ERROR: 
            return initialState
         default: 
            return state;
        }
    }