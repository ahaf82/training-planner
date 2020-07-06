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

    if (role === 'admin' || role === 'superUser') {
        columns = 3;
    }
    if (role === 'member' || role === 'none') {
        columns = 1;
    }



    return (
        <div className={`grid-${columns}`}>
            <div>
                {(role === 'admin' || role === 'superUser') &&
                <TrainingGroupForm /> }
                {(role === 'admin' || role === 'superUser') &&
                <TrainingGroupFilter /> }
                {(role === 'admin' || role === 'superUser') &&
                <TrainingGroups /> }
                {/* {role === 'member' &&
                    <TrainingSessionFilter /> } */}
                {role === 'member' &&
                    <TrainingSession /> }
                {role === 'none' &&
                    <h2 className="text-primary large">Melde dich bei deinem Trainer, damit er dich eincheckt</h2>}
            </div>
            <div>
                {(role === 'admin' || role === 'superUser') &&
                <TrainingSessionForm /> }
                {(role === 'admin' || role === 'superUser') &&
                <TrainingSessionFilter /> }
                {(role === 'admin' || role === 'superUser') &&
                <TrainingSession /> }
            </div>
            <div>
                { role === ('admin' || 'superUser') &&
                <MemberForm />
                }
                { role === ('admin' || 'superUser') &&
                <MemberFilter /> }
                <Member />
            </div>
        </div>
    )
}

Home.propTypes = {

}

export default Home;
