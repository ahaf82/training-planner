import React, { useContext, useRef, useEffect } from 'react';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext'

const TrainingSessionFilter = () => {
    const trainingSessionContext = useContext(TrainingSessionContext);
    const text = useRef('');

    const { filterTrainingSessions, clearFilter, filtered } = trainingSessionContext;

    useEffect(() => {
        if (filtered === null) {
            text.current.value = '';
        }
    });
    
    const onChange = e => {
        if (text.current.value !== '') {
            filterTrainingSessions(e.target.value);
        } else {
            clearFilter();
        }
    }

    return (
        <form>
            <input ref={text} type="text" placeholder="Suche Trainingseinheit..." onChange={onChange} />
        </form>
    )
}

export default TrainingSessionFilter;