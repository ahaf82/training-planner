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

    useEffect(() => {
        authContext.loadMember();
        // eslint-disable-next-line
    }, []);

    return (
        <div className='grid-4'>
            <div>
                <MemberForm />
                <MemberFilter />
                <Member />
            </div>
            <div>
                <TrainingGroupForm />
                <TrainingGroupFilter />
                <TrainingGroups />
            </div>
            <div>
                <TrainingSessionForm />
                <TrainingSessionFilter />
            </div>
            <div>
                <TrainingSession />
            </div>
        </div>
    )
}

Home.propTypes = {

}

export default Home;
