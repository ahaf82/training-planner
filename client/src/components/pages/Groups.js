import React, { useContext, useEffect } from 'react';
import TrainingGroups from '../trainingGroups/TrainingGroups';
import TrainingGroupForm from '../trainingGroups/TrainingGroupForm';
import TrainingGroupFilter from '../trainingGroups/TrainingGroupFilter';
import AuthContext from '../../context/auth/authContext';

const Groups = props => {
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
                    <TrainingGroupForm />}
            </div>
            <div className='card-grid-3'>
                {(role === 'admin' || role === 'superUser') &&
                    <TrainingGroupFilter />}
                {(role === 'admin' || role === 'superUser') &&
                    <TrainingGroups />}
            </div>
        </div>
    )
}

Groups.propTypes = {

}

export default Groups;
