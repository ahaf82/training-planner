import React, { useContext } from 'react';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

const ClearModalSession = ({ session }) => {
    const trainingSessionContext = useContext(TrainingSessionContext);
    const { deleteTrainingSession, clearCurrent, current } = trainingSessionContext;

    const onDelete = () => {
        deleteTrainingSession(current._id);
        clearCurrent();
    }

    return (
        <div id='clear-modal-session' className='modal'>
            <div className="modal-content">
            {current &&
                <h5><span className='text-bold'>{current.description}</span> wirklich löschen?</h5>}
                <div className="modal-footer">
                    <a href="#!" onClick={onDelete} className="modal-close btn btn-danger btn-sm btn">Löschen</a> {' '}
                    <a href="#!" className="modal-close btn btn-dark btn-sm btn">Abbrechen</a>
                </div>
            </div>
        </div>
    )
}

export default ClearModalSession;
