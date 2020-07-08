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
        columns = 2;
    }

    return (
        <div className={`grid-${columns}`}>
            <div>
                {(role === 'admin' || role === 'superUser') &&
                    <TrainingSessionForm />}
            </div>
            <div>
                {(role === 'admin' || role === 'superUser') &&
                    <TrainingSessionFilter />}
                {(role === 'admin' || role === 'superUser') &&
                    <TrainingSession />}
            </div>
        </div>
    )
}

Sessions.propTypes = {

}

export default Sessions;
