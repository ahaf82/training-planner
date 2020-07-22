import React, { useEffect, useContext } from 'react';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';

const TrainingGroupOptions = () => {
    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup, getTrainingGroups, loading } = trainingGroupContext;

    useEffect(() => {
        getTrainingGroups();
        // eslint-disable-next-line
    }, []);

    return (
        !loading && trainingGroup !== null && trainingGroup.map(group => (<option key={group._id} value={group._id} >
            {group.trainingGroup}
        </option>))
    )
}

export default TrainingGroupOptions;
