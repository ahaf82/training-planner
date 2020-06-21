import React, { useContext, useEffect } from 'react';
import TrainingGroups from '../trainingGroups/TrainingGroups';
import TrainingGroupForm from '../trainingGroups/TrainingGroupForm';
import TrainingGroupFilter from '../trainingGroups/TrainingGroupFilter';
import TrainingSession from '../trainingSessions/TrainingSessions';
import TrainingSessionForm from '../trainingSessions/TrainingSessionForm';
import TrainingSessionFilter from '../trainingSessions/TrainingSessionFilter';
import Member from '../member/Members';
import MemberForm from '../member/MemberForm';
import MemberFilter from '../member/MemberFilter';
import AuthContext from '../../context/auth/authContext';

const Home = props => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    useEffect(() => {
        authContext.loadMember();
        // eslint-disable-next-line
    }, []);

    let columns = 0;

    if (role === ('admin' || 'superUser')) {
        columns = 3;
    }  else {
        columns = 2;
    }

    return (
        <div className={`grid-${columns}`}>
            <div>
                {//<MemberForm />
                }
                { role === ('admin' || 'superUser') &&
                <MemberFilter /> }
                <Member />
            </div>
            <div>
                { role === ('admin' || 'superUser') &&
                <TrainingGroupForm /> }
                { role === ('admin' || 'superUser') &&
                <TrainingGroupFilter /> }
                <TrainingGroups />
            </div>
            <div>
                {role === ('admin' || 'superUser') &&
                <TrainingSessionForm /> }
                <TrainingSessionFilter />
                <TrainingSession />
            </div>
        </div>
    )
}

Home.propTypes = {

}

export default Home;
