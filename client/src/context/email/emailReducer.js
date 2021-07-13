import {
    GET_EMAILS,
    ADD_EMAIL,
    DELETE_EMAIL,
    EMAIL_ERROR,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_EMAIL,
    FILTER_EMAILS,
    CLEAR_FILTER,
    CLEAR_EMAILS
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case GET_EMAILS:
            console.log("payload", action.payload);
            return {
                ...state,
                emails: action.payload,
                loading: false
            };
        case ADD_EMAIL:
            console.log("add state mail", action.payload);
            return {
                ...state,
                emails: [action.payload, ...state.emails],
                loading: false
            };
        case UPDATE_EMAIL:
            return {
                ...state,
                emails: state.emails.map(session => session._id === action.payload._id ? action.payload : session),
                loading: false
            };
        case DELETE_EMAIL:
            return {
                ...state,
                emails: state.emails.filter(
                (session) => session._id !== action.payload
                ),
                loading: false
            };
        case CLEAR_EMAILS:
            return {
                ...state,
                emails: null,
                filtered: null,
                error: null,
                current: null
            };
        case SET_CURRENT:
            return {
                ...state,
                current: action.payload
            };
        case CLEAR_CURRENT:
            return {
                ...state,
                current: null
            };
        case FILTER_EMAILS:
            return {
                ...state,
                filtered: state.emails.filter(email => {
                    const regexEmail = new RegExp(`${action.payload}`, `gi`);
                    return email.name.match(regexEmail);
                })
            };
        case CLEAR_FILTER:
            return {
            ...state,
            filtered: null
            };
        case EMAIL_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}