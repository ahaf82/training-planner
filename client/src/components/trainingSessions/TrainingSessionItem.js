import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

const TrainingSessionItem = ({ session }) => {
    const trainingSessionContext = useContext(TrainingSessionContext);
    const { deleteTrainingSession, setCurrent, clearCurrent, current } = trainingSessionContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup } = trainingGroupContext;

    const memberContext = useContext(MemberContext);
    const { member } = memberContext;

    const { _id, description, maxMembers, memberCount, members, time, date } = session;

    const onDelete = () => {
        deleteTrainingSession(_id);
        clearCurrent();
    }

    let group = trainingGroup.filter(item => item._id === session.trainingGroup);
    
    console.log(group);
//    console.log(group);

    return (
        <div className='card bg-light'>
            <h3 className="text-primary text-left large">
                {description}{' '} 
            </h3>
            <ul className="list">
                {group && <li>
                    <i></i> Trainingsgruppe: {group[0].trainingGroup}
                </li> }
                {time && <li>
                    <i></i> Zeit: {time}
                </li>}
                {date && <li>
                    <i></i> Datum: {date}
                </li>}
                {maxMembers && <li>
                    <i></i> Maximale Teilnehmer: {maxMembers}
                </li>}
                {memberCount && <li>
                    <i></i> Angemeldete Teilnehmer: {memberCount}
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

export default TrainingSessionItem;