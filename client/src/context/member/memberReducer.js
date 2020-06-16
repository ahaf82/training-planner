import {
    GET_MEMBERS,
    ADD_MEMBER,
    DELETE_MEMBER,
    MEMBER_ERROR,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_MEMBER,
    FILTER_MEMBERS,
    CLEAR_FILTER,
    CLEAR_MEMBERS
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case GET_MEMBERS:
            return {
                ...state,
                members: action.payload,
                loading: false
            };
        case ADD_MEMBER:
            return {
                ...state,
                members: [action.payload, ...state.members],
                loading: false
            };
        case UPDATE_MEMBER:
            return {
                ...state,
                members: state.members.map(session => session._id === action.payload._id ? action.payload : session),
                loading: false
            };
        case DELETE_MEMBER:
            return {
                ...state,
                members: state.members.filter(
                (session) => session._id !== action.payload
                ),
                loading: false
            };
        case CLEAR_MEMBERS:
            return {
                ...state,
                members: null,
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
        case FILTER_MEMBERS:
            return {
                ...state,
                filtered: state.members.filter(member => {
                    const regexMember = new RegExp(`${action.payload}`, `gi`);
                    return member.name.match(regexMember);
                })
            };
        case CLEAR_FILTER:
            return {
            ...state,
            filtered: null
            };
        case MEMBER_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}