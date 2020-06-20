import React, { useContext, useRef, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';

const TrainingGroupFilter = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { filterTrainingGroups, clearFilter, filtered } = trainingGroupContext;
    
    const text = useRef('');

    useEffect(() => {
        if (filtered === null  && role === ('admin' || 'superUser')) {
            text.current.value = '';
        }
    });
    
    const onChange = e => {
        if (text.current.value !== '') {
            filterTrainingGroups(e.target.value);
        } else {
            clearFilter();
        }
    }

    return (
        <form>
            <input ref={text} type="text" placeholder="Suche Trainingsgruppe..." onChange={onChange} />
        </form>
    )
}

export default TrainingGroupFilter;