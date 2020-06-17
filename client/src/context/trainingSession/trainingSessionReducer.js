import {
    GET_TRAININGSESSIONS,
    ADD_TRAININGSESSION,
    DELETE_TRAININGSESSION,
    TRAININGSESSION_ERROR,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_TRAININGSESSION,
    FILTER_TRAININGSESSIONS,
    CLEAR_FILTER,
    CLEAR_TRAININGSESSIONS
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case GET_TRAININGSESSIONS:
            return {
                ...state,
                trainingSessions: action.payload,
                loading: false
            };
        case ADD_TRAININGSESSION:
            return {
                ...state,
                trainingSessions: [action.payload, ...state.trainingSessions],
                loading: false
            };
        case UPDATE_TRAININGSESSION:
            return {
                ...state,
                trainingSessions: state.trainingSessions.map(session => session._id === action.payload._id ? action.payload : session),
                loading: false
            };
        case DELETE_TRAININGSESSION:
            return {
                ...state,
                trainingSessions: state.trainingSessions.filter(
                (session) => session._id !== action.payload
                ),
                loading: false
            };
        case CLEAR_TRAININGSESSIONS:
            return {
                ...state,
                trainingSessions: null,
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
        case FILTER_TRAININGSESSIONS:
            return {
                ...state,
                filtered: state.trainingSessions.filter(session => {
                    const regexSession = new RegExp(`${action.payload}`, `gi`);
                    return session.description.match(regexSession);
                })
            };
        case CLEAR_FILTER:
            return {
            ...state,
            filtered: null
            };
        case TRAININGSESSION_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}