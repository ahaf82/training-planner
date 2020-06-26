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

    // let group = current.trainingGroup.includes(trainingGroup._id);
    let group = trainingGroup.map(tGroup => tGroup._id === session.trainingGroup);

    //if(group) {console.log('Gruppe: ' + group);};
    if(trainingGroup){console.log(trainingGroup)};
    //if(trainingGroup) {console.log('Grupe: ' + trainingGroup.map(group => group));};


    return (
        <div className='card bg-light'>
            <h3 className="text-primary text-left large">
                {description}{' '} 
            </h3>
            <ul className="list">
                {group && <li>
                    <i className="fas fa-envelope-open"></i> Trainingsgruppe: {group}
                </li> }
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

export default TrainingSessionItem;