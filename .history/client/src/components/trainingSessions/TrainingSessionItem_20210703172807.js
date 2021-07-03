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

const TrainingSessionItem = ({ session, checkIn }) => {
    const authContext = useContext(AuthContext);
    const { role, loading } = authContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { getTrainingSessions, deleteTrainingSession, setCurrent, clearCurrent, updateTrainingSession } = trainingSessionContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup, getTrainingGroups } = trainingGroupContext;

    const memberContext = useContext(MemberContext);
    const { getMembers } = memberContext;
    
    const { _id, description, maxMembers, memberCount, members, time, timeTo, date } = session;

    let group =[];
    let tra
    if(trainingGroup !== undefined) {
        group = trainingGroup.filter(item => item._id === session.trainingGroup);
    } 

    // const [checkInMember, setCheckInMember] = useState({
    //     _id: checkIn._id,
    //     name: checkIn.name
    // })
    
    const onDelete = () => {
        deleteTrainingSession(_id);
        clearCurrent();
    }
    
    const [checked, setChecked] = useState(false);
    
    useEffect(() => {
        // if (session.members.find(element => element === authContext.member._id) !== undefined) {
        if (checkIn.name) checkIn = checkIn._id
        console.log("checkIn", checkIn);
        // console.log("itemmember", checkInMember)
        // setCheckInMember(checkInMember);
        // console.log("checkIn", checkInMember);
        // if (session.members.find(element => element === checkInMember._id) !== undefined) {
        setChecked(false);
        if (session.members.find(element => element === checkIn) !== undefined) {
            setChecked(true);
        }
//    }, [authContext.member._id, getMembers, getTrainingGroups, getTrainingSessions, session.members]);
//    }, [checkIn, checkInMember, session.members]);
    }, [checkIn, session.members]);

    // Check In and Out in Training Session
    const onChange = (e) => {
        e.preventDefault();
        setChecked(!checked);
        if (maxMembers && !checked && (memberCount >= maxMembers)) {
            M.toast({ html: 'Kein Platz mehr frei', classes: 'red darken-2', displayLength: 1500 });
        }
        if (!checked && (memberCount < maxMembers || !maxMembers)) {
            // updateTrainingSession({ ...session, members: [...members, authContext.member._id], memberCount: memberCount+1 });
            // updateTrainingSession({ ...session, members: [...members, checkInMember._id], memberCount: memberCount+1 });
            updateTrainingSession({ ...session, members: [...members, checkIn], memberCount: memberCount+1 });
        }
        if (checked) {
            if (memberCount === 1) {
                // updateTrainingSession({ ...session, members: members.filter(item => item !== authContext.member._id), memberCount: "0" });
                // updateTrainingSession({ ...session, members: members.filter(item => item !== checkInMember._id), memberCount: "0" });
                updateTrainingSession({ ...session, members: members.filter(item => item !== checkIn), memberCount: "0" });
            } else {
                // updateTrainingSession({ ...session, members: members.filter(item => item !== authContext.member._id), memberCount: memberCount-1 });
                // updateTrainingSession({ ...session, members: members.filter(item => item !== checkInMember._id), memberCount: memberCount-1 });
                if ((memberCount-1)>=0) updateTrainingSession({ ...session, members: members.filter(item => item !== checkIn), memberCount: memberCount-1 });
                if ((memberCount-1)<0) updateTrainingSession({ ...session, members: members.filter(item => item !== checkIn), memberCount: memberCount });
            }
        }
    }
    
    // Convert ObjectMember Id to Name
    let sessionMembers;
    if (memberContext.members) {
        // console.log("context", memberContext.members);
        let subMembers = [ ...memberContext.members.filter(element => element.familyMember.length > 0).map(element => element.familyMember).flat(1) ];
        // console.log("subs", subMembers);
        let sessionSubMembers = subMembers.filter(obj => session.members.includes(obj._id));
        // console.log("groupsubs", sessionSubMembers);
        sessionMembers = [ ...memberContext.members.filter(element => session.members.includes(element._id)), ...sessionSubMembers ];        
        // sessionMembers = [...new Set(memberContext.members.filter(element => session.members.includes(element._id)))];
    }

    // Convert ObjectTrainer Id to Name
    let trainerName;
    if (memberContext.members && session.trainer) {
        trainerName = memberContext.members.filter(element => element._id === session.trainer);
    }

    return (
        <div className='column'>
            <div className={checked === true ? 'card bg-dark card-content' : 'card bg-light card-content'}>
                <h3 className={checked === true ? 'text- text-left large' : 'text-dark text-left large'}>
                    {description}{' '} 
                </h3>
                <ul className="list">
                    {trainingGroup && group[0] && group[0].trainingGroup && !loading && <li>
                        <i></i> Trainingsgruppe: {group[0].trainingGroup
                    }
                    </li>}                    
                    {memberContext.members && trainerName && !loading && <li>
                        <i></i> Trainer: {trainerName[0].name}
                    </li>}
                    {time && <li>
                        <i></i> Zeit: <time format='h:mm:ss'>{time}</time>{timeTo && <time format='h:mm:ss'>{` - ${timeTo}`}</time>}
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
                        <i class="fa fa-user"></i> <bold>Teilnehmer:</bold> <br/>
                                {sessionMembers.map(member => member.name).join(', ')}
                    </div>}
                </ul>
                {(role === 'admin' || role === 'superUser') &&  <p>
                    <button className="btn btn-dark btn-sm" onClick={() => setCurrent(session)}>Ändern</button>
                    <button data-target="clear-modal-session" class="btn btn-danger btn-sm modal-trigger" onClick={() => setCurrent(session)}>Löschen</button>
                 </p>}
                {(role === "member" || role === "admin" || role === "trainer")&&
                    <div class="switch">
                    <p>
                        <label>
                            Check Out
                            <input type="checkbox" key={session._id} className="filled-in" name={session._id} value={session.id} checked={checked} onChange={e => onChange(e, session._id)} disabled={maxMembers && !checked && (memberCount >= maxMembers)}/>
                            <span class="lever"></span>
                            Check In
                        </label>
                    </p>
                </div>}
            </div>
        </div>
    )
}

TrainingSessionItem.propTypes = {
    session: PropTypes.object.isRequired
}

export default TrainingSessionItem;