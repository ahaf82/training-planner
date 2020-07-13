import React, { useContext, useState, useEffect } from 'react'; 
import Moment from 'react-moment';
import 'moment/locale/de';
import PropTypes from 'prop-types';
import AuthContext from '../../context/auth/authContext';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';
import M from 'materialize-css/dist/js/materialize.min.js';


Moment.globalLocale = 'de';

const TrainingSessionItem = ({ session }) => {
    const authContext = useContext(AuthContext);
    const { role, loading } = authContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { deleteTrainingSession, setCurrent, clearCurrent, updateTrainingSession, current } = trainingSessionContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup } = trainingGroupContext;

    const memberContext = useContext(MemberContext);
    const { member } = memberContext;
    
    const { _id, description, maxMembers, memberCount, members, time, date } = session;

    let group =[];
    if(trainingGroup) {
        group = trainingGroup.filter(item => item._id === session.trainingGroup);
    }
    
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
            M.toast({ html: 'Kein Platz mehr frei', classes: 'red darken-2', displayLength: 1500 });
        }
        if (!checked && (memberCount < maxMembers || !maxMembers)) {
            updateTrainingSession({ ...session, members: [...members, authContext.member._id], memberCount: memberCount+1 });
        }
        if (checked) {
            if (memberCount === 1) {
                updateTrainingSession({ ...session, members: members.filter(item => item !== authContext.member._id), memberCount: "0" });
            } else {
                updateTrainingSession({ ...session, members: members.filter(item => item !== authContext.member._id), memberCount: memberCount-1 });
            }
        }
    }
    
    // Convert Object Id to Name
    let sessionMembers;
    if (memberContext.members) {
        sessionMembers = [...new Set(memberContext.members.filter(element => session.members.includes(element._id)))];
    }

    return (
        <div className='column'>
            <div className={checked === true ? 'card bg-dark card-content' : 'card bg-light card-content'}>
                <h3 className={checked === true ? 'text- text-left large' : 'text- text-left large'}>
                    {description}{' '} 
                </h3>
                <ul className="list">
                    {trainingGroup && group[0].trainingGroup && !loading &&  <li>
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
                {(role === 'admin' || role === 'superUser') &&  <p>
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
        </div>
    )
}

export default TrainingSessionItem;