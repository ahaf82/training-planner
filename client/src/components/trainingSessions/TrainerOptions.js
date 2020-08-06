import React, { useEffect, useContext } from 'react';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import MemberContext from '../../context/member/memberContext';

const TrainerOptions = () => {
    const trainingGroupContext = useContext(TrainingGroupContext);
    const { getTrainingGroups } = trainingGroupContext;

    const memberContext = useContext(MemberContext);
    const { members, getMembers, loading } = memberContext;
    
    useEffect(() => {
        getTrainingGroups();
        getMembers();
        // eslint-disable-next-line
    }, []);

    return (
        !loading && members !== null && members.filter(member => (member.role === 'admin' || member.role === 'trainer')).map(item => <option key={item._id} value={item._id} >
            {item.name}
        </option>)
    )
}

export default TrainerOptions;
