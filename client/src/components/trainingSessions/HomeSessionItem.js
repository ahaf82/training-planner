import React, { useContext, useState, useEffect } from 'react';
import Moment from 'react-moment';
import 'moment/locale/de';
import PropTypes from 'prop-types';
import AuthContext from '../../context/auth/authContext';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

Moment.globalLocale = 'de';

const HomeSessionItem = ({ session }) => {
    const authContext = useContext(AuthContext);
    const { role, loading } = authContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { deleteTrainingSession, setCurrent, clearCurrent, updateTrainingSession, current } = trainingSessionContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup } = trainingGroupContext;

    const memberContext = useContext(MemberContext);
    const { member } = memberContext;

    const { _id, description, maxMembers, memberCount, members, time, date } = session;

    let group = [];
    if (trainingGroup) {
        group = trainingGroup.filter(item => item._id === session.trainingGroup);
    }

    const [tSession, setTrainingSession] = useState({
        trainingGroup: "",
        description: "",
        maxMembers: "",
        memberCount: "",
        members: []
    });

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (session.members.find(element => element === authContext.member._id) !== undefined) {
            console.log(members.find(element => element === authContext.member._id));
            setChecked(true);
        }
    }, []);

    // Convert Object Id to Name
    let sessionMembers;
    if (memberContext.members) {
        sessionMembers = [...new Set(memberContext.members.filter(element => session.members.includes(element._id)))];
    }

    // Convert ObjectTrainer Id to Name
    let trainerName;
    if (memberContext.members && session.trainer) {
        trainerName = memberContext.members.filter(element => element._id === session.trainer);
    }

    return (
        <div className='column'>
            <div className={checked === true ? 'card bg-dark' : 'card bg-light card-content'}>
                <h3 className={checked === true ? 'text- text-left large' : 'text- text-left large'}>
                    {description}{' '}
                </h3>
                <ul className="list">
                    {trainingGroup && group[0].trainingGroup && !loading && <li>
                        <i></i> Trainingsgruppe: {group[0].trainingGroup
                        }
                    </li>}                    
                    {memberContext.members && trainerName && !loading && <li>
                        <i></i> Trainer: {trainerName[0].name}
                    </li>}
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
                    {(role === 'admin' || role === 'superUser') && sessionMembers && <div>
                        <i class="fa fa-user"></i> <bold>Teilnehmer:</bold> <br/>
                        {sessionMembers.map(member => member.name).join(', ')}
                    </div>}
                </ul>
            </div>
        </div>
    )
}

export default HomeSessionItem;