import {
    GET_TRAININGGROUPS,
    ADD_TRAININGGROUP,
    DELETE_TRAININGGROUP,
    TRAININGGROUP_ERROR,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_TRAININGGROUP,
    FILTER_TRAININGGROUPS,
    CLEAR_FILTER,
    CLEAR_TRAININGGROUPS
} from '../types';

export default (state, action) => {
    switch (action.type) {
        case GET_TRAININGGROUPS:
            return {
                ...state,
                trainingGroup: action.payload,
                loading: false
            };
        case ADD_TRAININGGROUP:
            return {
                ...state,
                trainingGroup: [action.payload, ...state.trainingGroup],
                loading: false
            };
        case UPDATE_TRAININGGROUP:
            console.log(action.payload)
            return {
                ...state,
                trainingGroup: state.trainingGroup.map(group => group._id === action.payload._id ? action.payload : group),
                loading: false
            };
        case DELETE_TRAININGGROUP:
            return {
                ...state,
                trainingGroup: state.trainingGroup.filter(
                (group) => group._id !== action.payload
                ),
                loading: false
            };
        case CLEAR_TRAININGGROUPS:
            return {
                ...state,
                trainingGroup: null,
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
        case FILTER_TRAININGGROUPS:
            return {
                ...state,
                filtered: state.trainingGroup.filter(group => {
                    const regex = new RegExp(`${action.payload}`, `gi`);
                    return group.trainingGroup.match(regex);
                })
            };
        case CLEAR_FILTER:
            return {
            ...state,
            filtered: null
            };
        case TRAININGGROUP_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}