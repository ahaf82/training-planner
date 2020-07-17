import React, { Fragment, useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TrainingSessionItem from './TrainingSessionItem';
import Spinner from '../layout/Spinner';
import moment from 'moment'
import AuthContext from '../../context/auth/authContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

const TrainingSession = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup } = trainingGroupContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { trainingSessions, filtered, getTrainingSessions, loading } = trainingSessionContext;

    useEffect(() => {
        getTrainingSessions();
        // eslint-disable-next-line
    }, []);
    
    if (trainingSessions !== null && trainingSessions.length === 0 && !loading && (role === 'admin' || role === 'superUser')) {
        return <h4>Bitte füge eine Trainingseinheit hinzu:</h4>
    }

    let tGroup = []
    if (trainingSessions && (role === 'admin' || role === 'superUser')) {
        tGroup = trainingSessions.filter(tSession => tSession.date >= moment(Date.now()).format('YYYY-MM-DD'));
    }

    // filter sessions for member
    if (trainingSessions && (role === 'member' || role === 'trainer')) {
        tGroup = trainingSessions.filter(tSession => authContext.member.trainingGroup.find((tGroup) => tGroup === tSession.trainingGroup) !== undefined);
        tGroup = tGroup.filter(tSession => tSession.date >= moment(Date.now()).format('YYYY-MM-DD'));
    }

    return (
        <Fragment>
            {tGroup !== null && !loading ? (
                <TransitionGroup>
                {filtered !== null 
                ? filtered.map(session => (
                    <CSSTransition key={session._id} timeout={300} classNames="item">
                    <TrainingSessionItem session={session} />
                    </CSSTransition>
                )) 
                : tGroup.map(session => ( 
                    <CSSTransition key={session._id} timeout={300} classNames="item">
                    <TrainingSessionItem session={session} />
                    </CSSTransition>
                ))}
                </TransitionGroup>
                ) : <Spinner />}
        </Fragment>
    )
}

export default TrainingSession;