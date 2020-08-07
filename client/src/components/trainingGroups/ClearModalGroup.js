import React, { Fragment, useState, useEffect, useContext } from 'react';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';
import M from 'materialize-css/dist/js/materialize.min.js';

const ClearModalGroup = () => {
    const trainingGroupContext = useContext(TrainingGroupContext);
    const { deleteTrainingGroup, current, clearCurrent } = trainingGroupContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { trainingSessions } = trainingSessionContext;
    
    useEffect(() => {
        if (current !== null) {
            setTrainingGroup(current);
        } else {
            setTrainingGroup({
                trainingGroup: ""
            });
        }
    }, [trainingGroupContext, current]);

    const [group, setTrainingGroup] = useState({
        trainingGroup: ''
    });

    const { _id } = group;

    // Delete training group item
    const onDelete = () => {
        if (trainingSessions) {
            const delResult = trainingSessions.filter(item => item.trainingGroup === _id);
            if (delResult[0]?.trainingGroup !== undefined) {
                M.toast({ html: 'Bitte erst alle Traininingseinheiten für die Gruppe löschen', classes: 'kentai-color', displayLength: 1500 });
            }
        } else {
            deleteTrainingGroup(_id);
            clearCurrent();
        }
    }

    return (
        <div id='clear-modal-group' className='modal'>
            <div className="modal-content">
            {current &&
                <h5><span className='text-bold'>{current.trainingGroup}</span> wirklich löschen?</h5>}
                <div className="modal-footer">
                    <a href="#!" onClick={onDelete} className="modal-close btn btn-danger btn-sm btn">Löschen</a> {' '}
                    <a href="#!" className="modal-close btn btn-dark btn-sm btn">Abbrechen</a>
                </div>
            </div>
        </div>
    )
}

export default ClearModalGroup;
