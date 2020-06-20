import React, { useContext, useRef, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext'

const TrainingSessionFilter = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { filterTrainingSessions, clearFilter, filtered } = trainingSessionContext;

    const text = useRef('');


    useEffect(() => {
        if (role === ('admin' || 'superUser' || 'member') && filtered === null) {
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
            { role === ('admin' || 'superUser' || 'member') && 
            <input ref={text} type="text" placeholder="Suche Trainingseinheit..." onChange={onChange} />
            }
        </form>
    )
}

export default TrainingSessionFilter;