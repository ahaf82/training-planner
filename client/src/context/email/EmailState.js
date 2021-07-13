import React, { useReducer } from 'react';
import axios from 'axios';
import EmailContext from './emailContext';
import emailReducer from './emailReducer';
import {
    GET_EMAILS,
    ADD_EMAIL,
    DELETE_EMAIL,
    EMAIL_ERROR,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_EMAIL,
    FILTER_EMAILS,
    CLEAR_EMAILS,
    CLEAR_FILTER
} from '../types';

const EmailState = props => {
    const initialState = {
        emails: [],
        current: null,
        filtered: null,
        error: null
    };

    const [state, dispatch] = useReducer(emailReducer, initialState);

    // Get Emails
    const getEmails = async () => {
        try {
            const res = await axios.get('/api/email');
            console.log("get res", res)
            dispatch({
                type: GET_EMAILS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: EMAIL_ERROR,
                payload: err.response.msg
            })
        }
    };


    // Add Email
    const addEmail = async email => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        
        console.log("email", email)
        try {
            const res = await axios.post('/api/email', email, config);
            console.log("result", res.data);
            dispatch({
                type: ADD_EMAIL,
                payload: res.data
            });
        } catch (error) {
            dispatch({
                type: EMAIL_ERROR,
                payload: error.response.msg
            })

        }
    };

    // Delete Email
    const deleteEmail = async id => {
        try {
            await axios.delete(`/api/email/${id}`);

            dispatch({
                type: DELETE_EMAIL,
                payload: id
            });
        } catch (err) {
            dispatch({
                type: EMAIL_ERROR,
                payload: err.response.msg
            })

        }

    };

    // Update Email
    const updateEmail = async email => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`/api/email/${email._id}`, email, config);

            dispatch({
                type: UPDATE_EMAIL,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: EMAIL_ERROR,
                payload: err.response.msg
            })

        }
    };

    // Clear Email
    const clearEmails = () => {
        dispatch({ type: CLEAR_EMAILS });
    }

    // Set Current 
    const setCurrent = email => {
        console.log("state", email);
        dispatch({ type: SET_CURRENT, payload: email });
    };

    // Clear Current Email
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT });
    };

    // Filter Emails
    const filterEmails = (text) => {
        dispatch({ type: FILTER_EMAILS, payload: text });
    };


    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    };


    return (
        <EmailContext.Provider
            value={{
                emails: state.emails,
                current: state.current,
                filtered: state.filtered,
                error: state.error,
                addEmail,
                deleteEmail,
                setCurrent,
                clearCurrent,
                updateEmail,
                filterEmails,
                clearFilter,
                getEmails,
                clearEmails
            }}>
            {props.children}
        </EmailContext.Provider>
    )
};

export default EmailState;