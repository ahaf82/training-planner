import React, { useContext, useEffect } from 'react';
import TrainingSession from '../trainingSessions/TrainingSessions';
import TrainingSessionForm from '../trainingSessions/TrainingSessionForm';
import TrainingSessionFilter from '../trainingSessions/TrainingSessionFilter';
import AuthContext from '../../context/auth/authContext';

const Sessions = props => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    useEffect(() => {
        authContext.loadMember();
        // eslint-disable-next-line
    }, []);

    let columns = 0;

    if (role === 'admin' || role === 'superUser') {
        columns = 3;
    }

    return (
        <div className={`grid-${columns}`}>
            <div className='fixed'>
                {(role === 'admin' || role === 'superUser') &&
                    <TrainingSessionForm />}
                <br/>
                {(role === 'admin' || role === 'superUser') &&
                    <TrainingSessionFilter />}
            </div>
            <div className='card-grid-2 card-grid-3'>
                {(role === 'admin' || role === 'superUser') &&
                    <TrainingSession />}
            </div>
        </div>
    )
}

Sessions.propTypes = {

}

export default Sessions;
