import React, { Fragment, useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TrainingSessionItem from './TrainingSessionItem';
import Spinner from '../layout/Spinner';
import moment from 'moment'
import AuthContext from '../../context/auth/authContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';
import MemberContext from '../../context/member/memberContext';

const TrainingSession = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { trainingSessions, filtered, getTrainingSessions, loading } = trainingSessionContext;

    const memberContext = useContext(MemberContext);
    const { _id } = memberContext;

    useEffect(() => {
        console.log("membbegin", member);
        console.log("chosenbegin", chosenMember);
        getTrainingSessions();
        setMember(chosenMember);
        // eslint-disable-next-line
    }, []);

    let [member, setMember] = useState({
        _id: authContext.member._id,
        name: authContext.member._id,
        role: authContext.member.role,
        trainingGroup: authContext.member.trainingGroup,
        trainingSessions: authContext.member.trainingSessions
    });

    let [chosenMember, setChosenMember] = useState({
        _id: authContext.member._id,
        name: authContext.member._id,
        role: authContext.member.role,
        trainingGroup: authContext.member.trainingGroup,
        trainingSessions: authContext.member.trainingSessions
    });

    const onChange = e => {
        setMember(e.target.value);

        // chosenMember = users.filter(item => item._id === e.target.value)[0];
        setChosenMember(users.filter(item => item._id === e.target.value)[0]);

        // setMember(chosenMember);
        console.log("chosenMember", chosenMember);
        console.log("member", member);
    }
    
    if (trainingSessions !== null && trainingSessions.length === 0 && !loading && (role === 'admin' || role === 'superUser')) {
        return <h4>Bitte füge eine Trainingseinheit hinzu:</h4>
    }

    let tGroup = []
    if (trainingSessions && (role === 'admin' || role === 'superUser')) {
        tGroup = trainingSessions.filter(tSession => tSession.date >= moment(Date.now()).format('YYYY-MM-DD'));
    }
    
    // let chosenMember = authContext.member;
    // filter sessions for member
    if (trainingSessions && (role === 'member' || role === 'trainer')) {
        // tGroup = trainingSessions.filter(tSession => authContext.member.trainingGroup.find((tGroup) => tGroup === tSession.trainingGroup) !== undefined);
        tGroup = trainingSessions.filter(tSession => chosenMember.trainingGroup.find((tGroup) => tGroup === tSession.trainingGroup) !== undefined);
        tGroup = tGroup.filter(tSession => tSession.date >= moment(Date.now()).format('YYYY-MM-DD'));
    }

    let users = [ authContext.member, ...authContext.member.familyMember ];

    // let chosenMember = users.filter(item => item._id === member)[0];

    return (
        <Fragment>
            <div className="column card bg-light">                
                <div className="input-field">
                    <select value={_id} name="member" className="browser-default" onChange={onChange}>
                            {users.map(item => <option key={item._id} value={item._id}> {item.name}</option>)}
                    </select>
                </div>
            </div>
            {tGroup !== null && !loading ? (
                <TransitionGroup>
                {filtered !== null 
                ? filtered.map(session => (
                    <CSSTransition key={session._id} timeout={300} classNames="item">
                    <TrainingSessionItem session={session} checkIn={member} />
                    </CSSTransition>
                )) 
                : tGroup.map(session => ( 
                    <CSSTransition key={session._id} timeout={300} classNames="item">
                    <TrainingSessionItem session={session} checkIn={member} />
                    </CSSTransition>
                ))}
                </TransitionGroup>
                ) : <Spinner />}
        </Fragment>
    )
}

export default TrainingSession;