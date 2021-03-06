import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    MEMBER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types';

export default(state, action) => {
    switch(action.type) {
        case MEMBER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                member: action.payload,
                role: action.payload.role
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,   
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            console.log(action.payload);
            return {
                ...state,
                token: null,
                isAuthenticated: null,
                loading: false,
                member: null,
                role: null,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
}