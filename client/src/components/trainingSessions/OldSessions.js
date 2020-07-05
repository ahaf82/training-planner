import React, { Fragment, useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TrainingSessionItem from './TrainingSessionItem';
import Spinner from '../layout/Spinner';
import moment from 'moment'
import AuthContext from '../../context/auth/authContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

const OldSessions = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { trainingSessions, filtered, getTrainingSessions, loading } = trainingSessionContext;

    useEffect(() => {
        getTrainingSessions();
        // eslint-disable-next-line
    }, []);

    let tGroup = []
    if (trainingSessions && (role === 'admin' || role === 'superUser')) {
        tGroup = trainingSessions.filter(tSession => tSession.date < moment(Date.now()).format('YYYY-MM-DD'));
    }
    
    return (
        <Fragment>
            {tGroup !== null && (role === 'admin' || role === 'superUser') && !loading ? (
                <TransitionGroup>
                    {tGroup.map(session => (
                        <CSSTransition key={session._id} timeout={300} classNames="item">
                            <TrainingSessionItem session={session} />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            ) : <Spinner />}
        </Fragment>
    )
}

export default OldSessions;