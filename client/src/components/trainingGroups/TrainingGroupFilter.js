import React, { useContext, useRef, useEffect } from 'react';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';

const TrainingGroupFilter = () => {
    const trainingGroupContext = useContext(TrainingGroupContext);
    const text = useRef('');

    const { filterTrainingGroups, clearFilter, filtered } = trainingGroupContext;

    useEffect(() => {
        if (filtered === null) {
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