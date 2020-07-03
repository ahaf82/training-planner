import React, { useContext } from 'react'; 
import Moment from 'react-moment';
import 'moment/locale/de';
import PropTypes from 'prop-types';
import AuthContext from '../../context/auth/authContext';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

Moment.globalLocale = 'de';

const TrainingSessionItem = ({ session }) => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

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

    const group = trainingGroup.filter(item => item._id === session.trainingGroup);

    return (
        <div className='card bg-light'>
            <h3 className="text-primary text-left large">
                {description}{' '} 
            </h3>
            <ul className="list">
                {group && <li>
                    <i></i> Trainingsgruppe: {group[0].trainingGroup
                    }
                </li> }
                {time && <li>
                    <i></i> Zeit: <time format='h:mm:ss'>{time}</time>
                </li>}
                {date && <li>
                    <i></i> Datum: <Moment format='Do MMMM YYYY'>{date}</Moment>
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
            {(role === 'admin' || role === 'superUser') &&<p> 
                <button className="btn btn-dark btn-sm" onClick={() => setCurrent(session)}>Ändern</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Löschen</button>
            </p>}
        </div>
    )
}

export default TrainingSessionItem;