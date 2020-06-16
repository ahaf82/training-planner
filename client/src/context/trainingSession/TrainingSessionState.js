import React, { useReducer } from 'react';
import axios from 'axios';
import TrainingSessionContext from './trainingSessionContext';
import trainingSessionReducer from './trainingSessionReducer';
import {
    GET_TRAININGSESSIONS,
    ADD_TRAININGSESSION,
    DELETE_TRAININGSESSION,
    TRAININGSESSION_ERROR,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_TRAININGSESSION,
    FILTER_TRAININGSESSIONS,
    CLEAR_TRAININGSESSIONS,
    CLEAR_FILTER
} from '../types';

const TrainingSessionState = props => {
    const initialState = {
        trainingSessions: null,
        current: null,
        filtered: null,
        error: null 
    };

    const [state, dispatch] = useReducer(trainingSessionReducer, initialState);

    // Get TrainingSessions
    const getTrainingSessions = async () => {
        try {
            const res = await axios.get('/api/training-session');
            
            dispatch({
                type: GET_TRAININGSESSIONS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: TRAININGSESSION_ERROR,
                //payload: err.response.msg
            })

        }
    };


    // Add Training Session
    const addTrainingSession = async trainingSession => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/training-session', trainingSession, config);
            
            dispatch({
                type: ADD_TRAININGSESSION,
                payload: res.data 
            });
        } catch (err) {
            dispatch({
                type: TRAININGSESSION_ERROR,
                payload: err.response.msg
            })
            
        }
    };

    // Delete TrainingSession
    const deleteTrainingSession = async id => {
        try {
            await axios.delete(`/api/training-session/${id}`);

            dispatch({
                type: DELETE_TRAININGSESSION,
                payload: id
            });
        } catch (err) {
            dispatch({
                type: TRAININGSESSION_ERROR,
                payload: err.response.msg
            })

        }

    };

    // Update TrainingSession
    const updateTrainingSession = async trainingSession => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`/api/training-session/${trainingSession._id}`, trainingSession, config);

            dispatch({
                type: UPDATE_TRAININGSESSION,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: TRAININGSESSION_ERROR,
                //payload: err.response.msg
            })

        }
    };

        // Clear TrainingSession
    const clearTrainingSessions = () => {
        dispatch({ type: CLEAR_TRAININGSESSIONS });
    }

    // Set Current 
     const setCurrent = trainingSession => {
       dispatch({ type: SET_CURRENT, payload: trainingSession });
     };
   
    // Clear Current TrainingSession
     const clearCurrent = () => {
       dispatch({ type: CLEAR_CURRENT });
     };
   
    // Filter TrainingSessions
    const filterTrainingSessions = (text) => {
        dispatch({ type: FILTER_TRAININGSESSIONS, payload: text });
    };


    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    };


    return(
        <TrainingSessionContext.Provider
            value = {{
                trainingSessions: state.trainingSessions,
                current: state.current,
                filtered: state.filtered,
                error: state.error,
                addTrainingSession,
                deleteTrainingSession,
                setCurrent,
                clearCurrent,
                updateTrainingSession,
                filterTrainingSessions,
                clearFilter,
                getTrainingSessions,
                clearTrainingSessions
            }}>
            { props.children }
        </TrainingSessionContext.Provider>
    )
};

export default TrainingSessionState;