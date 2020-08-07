import React, { Fragment, useState, useEffect, useContext } from 'react';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';

const ClearModalMember = () => {
    
    const memberContext = useContext(MemberContext);
    const { current, deleteMember, clearCurrent, getMembers } = memberContext;
    
    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup, getTrainingGroups, updateTrainingGroup } = trainingGroupContext;
    
    useEffect(() => {
        if (current !== null) {
            setMember(current);
        } else {
            setMember({
                name: "",
                email: "",
                role: "",
                trainingGroup: [],
                trainingSessions: []
            });
        }
        getTrainingGroups();
        // eslint-disable-next-line
    }, [memberContext, current]);

    const [member, setMember] = useState({
        name: "",
        email: "",
        role: "",
        trainingGroup: [],
        trainingSessions: []
    });
    
    const onDelete = () => {
        deleteMember(current._id);
        clearCurrent();
    }

    return (
        <div id='clear-modal-member' className='modal'>
            <div className="modal-content">
            {current &&
                    <h5><span className='text-bold'>{current.name}</span> wirklich löschen?</h5>}
                <div className="modal-footer">
                    <a href="#!" onClick={onDelete} className="modal-close btn btn-danger btn-sm btn">Löschen</a> {' '}
                    <a href="#!" className="modal-close btn btn-dark btn-sm btn">Abbrechen</a>
                </div>
            </div>
        </div>
    )
}

export default ClearModalMember;
