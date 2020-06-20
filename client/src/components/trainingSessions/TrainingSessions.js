import React, { Fragment, useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TrainingSessionItem from './TrainingSessionItem';
import Spinner from '../layout/Spinner';
import AuthContext from '../../context/auth/authContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

const TrainingSession = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { trainingSessions, filtered, getTrainingSessions, loading } = trainingSessionContext;

    useEffect(() => {
        getTrainingSessions();
        // eslint-disable-next-line
    }, []);
    
    if (trainingSessions !== null && trainingSessions.length === 0 && !loading && role === ('admin' || 'superUser')) {
        return <h4>Bitte füge eine Trainingseinheit hinzu:</h4>
    }

    return (
        <Fragment>
            {trainingSessions !== null && !loading ? (
                <TransitionGroup>
                {filtered !== null 
                ? filtered.map(session => (
                    <CSSTransition key={session._id} timeout={300} classNames="item">
                    <TrainingSessionItem session={session} />
                    </CSSTransition>
                )) 
                : trainingSessions.map(session => (
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