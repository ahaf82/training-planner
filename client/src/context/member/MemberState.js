import React, { useReducer } from 'react';
import axios from 'axios';
import MemberContext from './memberContext';
import memberReducer from './memberReducer';
import {
    GET_MEMBERS,
    ADD_MEMBER,
    DELETE_MEMBER,
    MEMBER_ERROR,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_MEMBER,
    FILTER_MEMBERS,
    CLEAR_MEMBERS,
    CLEAR_FILTER
} from '../types';

const MemberState = props => {
    const initialState = {
        members: null,
        current: null,
        filtered: null,
        error: null 
    };

    const [state, dispatch] = useReducer(memberReducer, initialState);

    // Get Members
    const getMembers = async () => {
        try {
            const res = await axios.get('/api/member');
            dispatch({
                type: GET_MEMBERS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: MEMBER_ERROR,
                payload: err.response.msg
            })

        }
    };


    // Add Member
    const addMember = async member => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/member', member, config);
            console.log(res.data);
            dispatch({
                type: ADD_MEMBER,
                payload: res.data 
            });
        } catch (error) {
            dispatch({
                type: MEMBER_ERROR,
                payload: error.response.msg
            })
            
        }
    };

    // Delete Member
    const deleteMember = async id => {
        try {
            await axios.delete(`/api/member/${id}`);

            dispatch({
                type: DELETE_MEMBER,
                payload: id
            });
        } catch (err) {
            dispatch({
                type: MEMBER_ERROR,
                payload: err.response.msg
            })

        }

    };

    // Update Member
    const updateMember = async member => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`/api/member/${member._id}`, member, config);

            dispatch({
                type: UPDATE_MEMBER,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: MEMBER_ERROR,
                payload: err.response.msg
            })

        }
    };

    // Clear Member
    const clearMembers = () => {
        dispatch({ type: CLEAR_MEMBERS });
    }

    // Set Current 
     const setCurrent = member => {
       dispatch({ type: SET_CURRENT, payload: member });
     };
   
    // Clear Current Member
     const clearCurrent = () => {
       dispatch({ type: CLEAR_CURRENT });
     };
   
    // Filter Members
    const filterMembers = (text) => {
        dispatch({ type: FILTER_MEMBERS, payload: text });
    };


    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    };


    return(
        <MemberContext.Provider
            value = {{
                members: state.members,
                current: state.current,
                filtered: state.filtered,
                error: state.error,
                addMember,
                deleteMember,
                setCurrent,
                clearCurrent,
                updateMember,
                filterMembers,
                clearFilter,
                getMembers,
                clearMembers
            }}>
            { props.children }
        </MemberContext.Provider>
    )
};

export default MemberState;