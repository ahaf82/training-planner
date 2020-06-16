import React, { useReducer } from 'react';
import axios from 'axios';
import TrainingGroupContext from './trainingGroupContext';
import trainingGroupReducer from './trainingGroupReducer';
import {
    GET_TRAININGGROUPS,
    ADD_TRAININGGROUP,
    DELETE_TRAININGGROUP,
    TRAININGGROUP_ERROR,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_TRAININGGROUP,
    FILTER_TRAININGGROUPS,
    CLEAR_TRAININGGROUPS,
    CLEAR_FILTER
} from '../types';

const TrainingGroupState = props => {
    const initialState = {
        trainingGroup: null,
        current: null,
        filtered: null,
        error: null 
    };

    const [state, dispatch] = useReducer(trainingGroupReducer, initialState);

    // Get TrainingGroups
    const getTrainingGroups = async () => {
        try {
            const res = await axios.get('/api/training-group');
            dispatch({
                type: GET_TRAININGGROUPS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: TRAININGGROUP_ERROR,
                payload: err.response.msg
            })

        }
    };


    // Add TrainingGroup
    const addTrainingGroup = async trainingGroup => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/training-group', trainingGroup, config);
            
            dispatch({
                type: ADD_TRAININGGROUP,
                payload: res.data 
            });
        } catch (err) {
            dispatch({
                type: TRAININGGROUP_ERROR,
                payload: err.response.msg
            })
            
        }
    };

    // Delete TrainingGroup
    const deleteTrainingGroup = async id => {
        try {
            await axios.delete(`/api/training-group/${id}`);

            dispatch({
                type: DELETE_TRAININGGROUP,
                payload: id
            });
        } catch (err) {
            dispatch({
                type: TRAININGGROUP_ERROR,
                payload: err.response.msg
            })

        }

    };

    // Update TrainingGroup
    const updateTrainingGroup = async trainingGroup => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`/api/training-group/${trainingGroup._id}`, trainingGroup, config);

            dispatch({
                type: UPDATE_TRAININGGROUP,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: TRAININGGROUP_ERROR,
                //payload: err.response.msg
            })

        }
    };

    // Clear TrainingGroups
    const clearTrainingGroups = () => {
        dispatch({ type: CLEAR_TRAININGGROUPS });
    }

    // Set Current 
     const setCurrent = trainingGroup => {
       dispatch({ type: SET_CURRENT, payload: trainingGroup });
     };
   
    // Clear Current TrainingGroup
     const clearCurrent = () => {
       dispatch({ type: CLEAR_CURRENT });
     };
   
    // Filter TrainingGroups
    const filterTrainingGroups = (text) => {
        dispatch({ type: FILTER_TRAININGGROUPS, payload: text });
    };


    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    };


    return(
        <TrainingGroupContext.Provider
            value = {{
                trainingGroup: state.trainingGroup,
                current: state.current,
                filtered: state.filtered,
                error: state.error,
                addTrainingGroup,
                deleteTrainingGroup,
                setCurrent,
                clearCurrent,
                updateTrainingGroup,
                filterTrainingGroups,
                clearFilter,
                getTrainingGroups,
                clearTrainingGroups
            }}>
            { props.children }
        </TrainingGroupContext.Provider>
    )
};

export default TrainingGroupState;