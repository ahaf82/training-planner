import React, { useContext, useState, useEffect } from 'react'; 
import Moment from 'react-moment';
import 'moment/locale/de';
import PropTypes from 'prop-types';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

Moment.globalLocale = 'de';

const TrainingSessionItem = ({ session }) => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { deleteTrainingSession, setCurrent, clearCurrent, updateTrainingSession ,current } = trainingSessionContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup } = trainingGroupContext;

    const memberContext = useContext(MemberContext);
    const { member } = memberContext;

    const { _id, description, maxMembers, memberCount, members, time, date } = session;

    const group = trainingGroup.filter(item => item._id === session.trainingGroup);
    
    const [tSession, setTrainingSession] = useState({
        trainingGroup: "",
        description: "",
        maxMembers: "",
        memberCount: "",
        members: []
    });


    const onDelete = () => {
        deleteTrainingSession(_id);
        clearCurrent();
    }
    
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (session.members.find(element => element === authContext.member._id) !== undefined) {
            console.log(members.find(element => element === authContext.member._id));
            setChecked(true);
        }
    }, []);

    // Check In and Out in Training Session
    const onChange = (e) => {
        e.preventDefault();
        setChecked(!checked);
        if (maxMembers && !checked && (memberCount >= maxMembers)) {
            setAlert('Kein Platz mehr frei', 'danger');
        }
        if (!checked && (memberCount < maxMembers || !maxMembers)) {
            updateTrainingSession({ ...session, members: [...members, authContext.member._id], memberCount: memberCount+1 });
            console.log(members);
            console.log(memberCount);
        }
        if (checked) {
            console.log('Checked');
            if (memberCount === 1) {
                updateTrainingSession({ ...session, members: members.filter(item => item !== authContext.member._id), memberCount: "0" });
                console.log(members);
                console.log(memberCount);
            } else {
                updateTrainingSession({ ...session, members: members.filter(item => item !== authContext.member._id), memberCount: memberCount-1 });
                console.log(members);
                console.log(memberCount);
            }
        }
    }

    // Convert Object Id to Name
    let sessionMembers;
    if (memberContext.members) {
        sessionMembers = [...new Set(memberContext.members.filter(element => session.members.includes(element._id)))];
    }
    if(sessionMembers) console.log(sessionMembers);
    console.log(memberContext.member);

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
                {(role === 'admin' || role === 'superUser' ) && sessionMembers && <div>
                    <i class="fa fa-user"></i> <bold>Teilnehmer:</bold>
                            {sessionMembers.map(member => <li key={member._id}>{member.name}</li>)}
                </div>}
            </ul>
            {(role === 'admin' || role === 'superUser') && <p>
                <button className="btn btn-dark btn-sm" onClick={() => setCurrent(session)}>Ändern</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Löschen</button>
            </p>}
            {role === "member" &&
                <div class="switch">
                    Teilnahme
                <label>
                    : Check Out
                    <input type="checkbox" key={session._id} className="filled-in" name={session._id} value={session.id} checked={checked} onChange={e => onChange(e, session._id)} disabled={maxMembers && !checked && (memberCount >= maxMembers)}/>
                    <span class="lever"></span>
                    Check In
                </label>
            </div>}
        </div>
    )
}

export default TrainingSessionItem;