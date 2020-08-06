import React, { Fragment, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TrainingGroupItem from './TrainingGroupItem';
import Spinner from '../layout/Spinner';
import AuthContext from '../../context/auth/authContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';

const TrainingGroups = () => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup, filtered, loading } = trainingGroupContext;    

    if (trainingGroup !== null && trainingGroup.length === 0 && !loading && role === ('admin' || 'superUser')) {
        return <h4 className="large">Bitte füge eine Trainingsgruppe hinzu:</h4>
    }

    return (
        <Fragment>
            {trainingGroup !== null && !loading ? (
                <TransitionGroup>
                {filtered !== null 
                ? filtered.map(group => (
                    <CSSTransition key={group._id} timeout={300} classNames="item">
                    <TrainingGroupItem group={group} />
                    </CSSTransition>
                )) 
                : trainingGroup.map(group => (
                    <CSSTransition key={group._id} timeout={300} classNames="item">
                    <TrainingGroupItem group={group} />
                    </CSSTransition>
                ))}
                </TransitionGroup>
                ) : <Spinner />}
        </Fragment>
    )
}

export default TrainingGroups;