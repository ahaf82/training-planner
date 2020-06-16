import React, { Fragment, useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TrainingGroupItem from './TrainingGroupItem';
import Spinner from '../layout/Spinner'
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';

const TrainingGroups = () => {
    const trainingGroupContext = useContext(TrainingGroupContext);
    
    const { trainingGroup, filtered, getTrainingGroups, loading } = trainingGroupContext;

    useEffect(() => {
        getTrainingGroups();
        // eslint-disable-next-line
    }, []);


    if (trainingGroup !== null && trainingGroup.length === 0 && !loading) {
        return <h4>Bitte füge eine Trainingsgruppe hinzu:</h4>
    }

    return (
        <Fragment>
            {trainingGroup !== null && !loading ? (
                <TransitionGroup>
                {filtered !== null 
                ? filtered.map(group => (
                    <CSSTransition key={group._id} timeout={500} classNames="item">
                    <TrainingGroupItem group={group} />
                    </CSSTransition>
                )) 
                : trainingGroup.map(group => (
                    <CSSTransition key={group._id} timeout={500} classNames="item">
                    <TrainingGroupItem group={group} />
                    </CSSTransition>
                ))}
                </TransitionGroup>
                ) : <Spinner />}
        </Fragment>
    )
}

export default TrainingGroups;