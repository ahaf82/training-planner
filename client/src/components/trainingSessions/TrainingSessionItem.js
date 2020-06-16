import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

const TrainingSessionItem = ({ session }) => {
    const trainingSessionContext = useContext(TrainingSessionContext);
    const { deleteTrainingSession, setCurrent, clearCurrent } = trainingSessionContext;

    const { _id, trainingGroup, description, maxMembers, memberCount, members, time, date } = session;

    const onDelete = () => {
        deleteTrainingSession(_id);
        clearCurrent();
    }

    return (
        <div className='card bg-light'>
            <h3 className="text-primary text-left">
                {description}{' '} 
            </h3>
            <ul className="list">
                {trainingGroup && <li>
                    <i className="fas fa-envelope-open"></i> Trainingsgruppe: {trainingGroup}
                </li>}
                {time && <li>
                    <i className="fas fa-envelope-open"></i> Zeit: {time}
                </li>}
                {date && <li>
                    <i className="fas fa-envelope-open"></i> Datum: {date}
                </li>}
                {maxMembers && <li>
                    <i className="fas fa-envelope-open"></i> Maximale Teilnehmer: {maxMembers}
                </li>}
                {memberCount && <li>
                    <i className="fas fa-envelope-open"></i> Angemeldete Teilnehmer: {memberCount}
                </li>}
                {members && <li>
                    <i className="fas fa-phone"></i> {members}
                </li>}
            </ul>
            <p> 
                <button className="btn btn-dark btn-sm" onClick={() => setCurrent(session)}>Ändern</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Löschen</button>
            </p>
        </div>
    )
}

TrainingSessionItem.propTypes = {
    trainingSessions: PropTypes.object.isRequired
}

export default TrainingSessionItem;